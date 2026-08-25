import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().min(1).max(2000) })).min(1).max(16),
});

const TAMTA_CONTEXT = `You are TAMTA Concierge, the AI creative assistant for TAMTA Studios.

TAMTA Studios is a premium creative studio focused on visual storytelling. Its core capabilities are:
- Film: cinematic stories, branded films, short films and production from concept to final delivery.
- Advertising: creative campaigns, commercials, visual concepts and brand storytelling.
- Photography: editorial, product, cinematic and campaign photography.
- Motion: motion-led visual communication, moving image and finishing.
- Creative Lab: developing unusual concepts, visual directions and experiments from an early idea to a finished creative.

Your job is to help visitors understand TAMTA, explore creative ideas and turn vague ideas into useful production briefs. You can discuss creative direction, formats, audiences, references, locations, timelines, production considerations and approximate budgets. Do not invent specific TAMTA clients, awards, prices, portfolio projects or capabilities that are not in the context above. If something is unknown, say so and ask a useful follow-up question.

Be conversational, thoughtful and concise. Think through the user's request before answering. Do not sound like a generic customer-support bot. When useful, give options or a short structured plan. Keep the tone premium, calm, creative and human.

If someone asks what TAMTA offers, explain the five areas naturally. If someone has an idea, help shape it instead of immediately pushing them to an enquiry form. When the visitor is ready to start a project, guide them toward the Start a Project / enquiry section.`;

const demoReply = (messages: z.infer<typeof schema>['messages']) => {
  const latest = messages[messages.length - 1].text.toLowerCase();
  if (latest.includes("offer") || latest.includes("service") || latest.includes("what do you")) {
    return "Welcome to TAMTA Studios. We work across Film, Advertising, Photography, Motion and our Creative Lab — taking ideas from early concept through to the final frame. If you tell me what you're trying to create, I can help you find the right direction.";
  }
  if (latest.includes("advert") || latest.includes("campaign") || latest.includes("brand")) {
    return "For advertising, TAMTA can help shape the creative idea, visual language and production approach. Tell me the brand, audience and what you want people to feel or do — I can help develop a few creative directions.";
  }
  if (latest.includes("film") || latest.includes("cinematic")) {
    return "For film, we can think through the story, mood, visual language, locations, production scale and final delivery. What's the idea you have in mind? Even a rough thought is enough to start.";
  }
  if (latest.includes("photo") || latest.includes("photography")) {
    return "TAMTA works with editorial, product, cinematic and campaign photography. Tell me what you're photographing and where the images will be used, and I can help shape the visual direction.";
  }
  return "I'd love to hear the idea. Tell me what you're trying to make, who it's for, and anything you already know — format, mood, reference, timeline or budget. We can shape it from there.";
};

export async function POST(request: Request) {
  try {
    const { messages } = schema.parse(await request.json());
    const apiKey = process.env.OPENAI_API_KEY;

    // Demo mode keeps the concierge useful until the OpenAI key is added in Vercel.
    if (!apiKey) {
      return NextResponse.json({ ok: true, reply: demoReply(messages), agent: "tamta-concierge-demo" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: TAMTA_CONTEXT,
        input: messages.map((m) => ({ role: m.role, content: m.text })),
        max_output_tokens: 700,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI Responses API error", response.status, await response.text());
      return NextResponse.json({ ok: true, reply: demoReply(messages), agent: "tamta-concierge-fallback" });
    }

    const data = await response.json();
    const reply = typeof data.output_text === "string" ? data.output_text.trim() : "";
    return NextResponse.json({
      ok: true,
      reply: reply || demoReply(messages),
      agent: "tamta-concierge-ai",
    });
  } catch (error) {
    console.error("TAMTA Concierge error", error);
    return NextResponse.json({ ok: false, reply: "I couldn't process that right now. Please try again." }, { status: 400 });
  }
}
