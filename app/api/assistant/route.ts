import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ message: z.string().min(1).max(1000) });

function reply(message: string) {
  const q = message.toLowerCase();
  if (q.includes("price") || q.includes("budget") || q.includes("cost")) return "We scope every production around the creative, crew, locations, post and timeline. Tell me the kind of project and approximate budget range, and I can shape the next step.";
  if (q.includes("film") || q.includes("commercial") || q.includes("ad")) return "For film and advertising, TAMTA can take a project from concept and creative direction through production, edit, colour and final delivery. Start a project and include the campaign goal and timeline.";
  if (q.includes("photo") || q.includes("photography") || q.includes("shoot")) return "We can help with editorial, product and cinematic photography. Tell me the subject, location and intended use and we'll turn it into a production brief.";
  if (q.includes("portfolio") || q.includes("work")) return "Explore the selected work on this page. If a particular visual direction is close to what you want, mention it in your enquiry and we'll use it as creative reference.";
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) return "Welcome to TAMTA Studios. What are you imagining — a film, campaign, photography project, or a completely new visual world?";
  return "That sounds interesting. I can help turn the idea into a production brief. Tell me the goal, audience, format, timeline and anything you already have — references, script, location or budget.";
}

export async function POST(request: Request) {
  try {
    const { message } = schema.parse(await request.json());
    return NextResponse.json({ ok: true, reply: reply(message), agent: "tamta-concierge-v1" });
  } catch {
    return NextResponse.json({ ok: false, reply: "Please tell me a little more about the project." }, { status: 400 });
  }
}
