import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  brief: z.string().min(10).optional(),
  project: z.string().optional(),
  message: z.string().min(10).optional(),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const brief = data.brief || data.message || "";

    if (brief.length < 10) {
      return NextResponse.json(
        { ok: false, message: "Please add a little more detail about your project." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { ok: false, message: "Email service is not configured yet." },
        { status: 500 },
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "TAMTA Studios <onboarding@resend.dev>",
        to: ["holakumar2@gmail.com"],
        reply_to: data.email,
        subject: `New TAMTA Studios enquiry — ${data.project || data.company || "New project"}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1d1d1f">
            <h1 style="font-size:28px;margin-bottom:8px">New TAMTA Studios enquiry</h1>
            <p style="color:#6e6e73">Someone submitted the enquiry form on TAMTA Studios.</p>
            <hr style="border:0;border-top:1px solid #ddd;margin:24px 0" />
            <p><strong>Name</strong><br/>${escapeHtml(data.name)}</p>
            <p><strong>Email</strong><br/>${escapeHtml(data.email)}</p>
            <p><strong>Project</strong><br/>${escapeHtml(data.project || data.company || "—")}</p>
            <p><strong>Brief</strong><br/>${escapeHtml(brief).replace(/\n/g, "<br/>")}</p>
          </div>
        `,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error", result);
      return NextResponse.json(
        { ok: false, message: "We couldn't send your enquiry right now." },
        { status: 502 },
      );
    }

    console.log("TAMTA enquiry email sent", { id: result?.id });
    return NextResponse.json({ ok: true, message: "Enquiry received" }, { status: 201 });
  } catch (error) {
    console.error("TAMTA enquiry error", error);
    return NextResponse.json(
      { ok: false, message: "Please check your enquiry details." },
      { status: 400 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
