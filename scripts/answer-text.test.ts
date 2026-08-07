/**
 * Run: npx tsx scripts/answer-text.test.ts
 *
 * The answer renderer parses model output, which is the least predictable input
 * in the app. These are the two things that break silently: a link the model
 * pasted despite being told not to, and a step list that stops being a list.
 */
import assert from "assert";
import { withoutLinks, STEP, BULLET } from "../src/components/chat/AnswerText";

// A line that was only a link label disappears entirely.
assert.deepStrictEqual(
  withoutLinks("Fill in the form.\n**Form link:** https://nust.edu.pk/a.pdf\nSubmit it."),
  ["Fill in the form.", "Submit it."],
);

// A link inside a sentence goes; the sentence stays.
assert.deepStrictEqual(withoutLinks("Download it at https://x.pdf today"), ["Download it at today"]);

// Markdown links keep their text. The truncated form is what actually shipped:
// the URL was stripped first and left "[Download the form](" on screen.
assert.deepStrictEqual(withoutLinks("[Download the form](https://x.pdf) now"), [
  "Download the form now",
]);
assert.deepStrictEqual(withoutLinks("[Download the form](https://x.pdf"), ["Download the form"]);

// Only numbered lines are steps. Bullets are bullets, prose is prose.
for (const line of ["1. Pay the fee", "2) Pay the fee"]) {
  assert.strictEqual(line.match(STEP)?.[1], "Pay the fee", line);
}
assert.strictEqual("- Pay the fee".match(STEP), null);
assert.strictEqual("You need 75% attendance.".match(STEP), null);

// Every dash the model reaches for, not just the ASCII one: gpt-oss writes
// U+2011, which is why a dashed list rendered as flat paragraphs.
for (const dash of ["-", "‐", "‑", "–", "—", "−", "•", "*"]) {
  assert.strictEqual(`${dash} Pay the fee`.match(BULLET)?.[1], "Pay the fee", dash);
}
assert.strictEqual("You need 75% attendance.".match(BULLET), null);

console.log("ok");
