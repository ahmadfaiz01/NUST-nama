/**
 * POST /api/ask — one question, streamed back as server-sent events.
 *
 * Order matters: session, then quota, then cache, then the agent. Each gate is
 * cheaper than the one after it.
 */

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { askAgent, type Source } from "@/lib/chat/agent";
import { checkQuota } from "@/lib/chat/quota";
import { getCached, putCached } from "@/lib/chat/cache";

export const runtime = "nodejs";
export const maxDuration = 60;

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

function sse(event: unknown): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Sign in to ask a question." }, { status: 401 });
  }

  const { question } = (await request.json().catch(() => ({}))) as { question?: string };
  if (!question?.trim()) {
    return Response.json({ error: "Ask something." }, { status: 400 });
  }

  const quota = await checkQuota(user.id);
  if (!quota.allowed) {
    return Response.json(
      {
        error: `You've asked your ${quota.limit} questions for today. Try again tomorrow.`,
      },
      { status: 429 },
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: unknown) => controller.enqueue(new TextEncoder().encode(sse(event)));

      try {
        const cached = await getCached(question);
        if (cached) {
          send({ type: "answer", text: cached.answer, sources: cached.sources, cached: true });
          // Still recorded: a cached answer is a question asked, and quota counts
          // questions, not model calls.
          await admin.from("chat_messages").insert({
            user_id: user.id,
            question,
            answer: cached.answer,
            sources: cached.sources,
          });
          return;
        }

        const tools: string[] = [];
        for await (const event of askAgent(question, user.id)) {
          if (event.type === "tool") {
            tools.push(event.name);
            send(event);
          } else if (event.type === "busy") {
            send({ type: "busy", text: "NUST Nama is busy right now. Try again shortly." });
          } else {
            send({ type: "answer", text: event.text, sources: event.sources });
            // Logged loudly: this row is what the daily quota counts, so a silent
            // failure here hands every user an unlimited allowance.
            const { error } = await admin.from("chat_messages").insert({
              user_id: user.id,
              question,
              answer: event.text,
              sources: event.sources as unknown as Source[],
              tool_calls: tools,
              provider: event.provider,
            });
            if (error) console.error("[ask] chat_messages insert failed:", error.message);
            await putCached(question, event.text, event.sources);
          }
        }
      } catch (error) {
        console.error("[ask] failed:", error);
        send({ type: "busy", text: "Something went wrong. Try again shortly." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
