// supabase/functions/embed/index.ts
const session = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  const { texts } = await req.json();
  if (!Array.isArray(texts) || texts.length === 0) {
    return new Response(JSON.stringify({ error: "texts must be a non-empty array" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  if (texts.length > 100) {
    return new Response(JSON.stringify({ error: "max 100 texts per call" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  const embeddings: number[][] = [];
  for (const t of texts) {
    embeddings.push(await session.run(t, { mean_pool: true, normalize: true }) as number[]);
  }
  return new Response(JSON.stringify({ embeddings }), {
    headers: { "Content-Type": "application/json" },
  });
});
