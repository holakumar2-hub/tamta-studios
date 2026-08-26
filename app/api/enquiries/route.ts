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

    const project = data.project || data.company || "New project";
    const resendHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    // Keep the existing notification to TAMTA exactly as before.
    const notificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: resendHeaders,
      body: JSON.stringify({
        from: "TAMTA Studios <onboarding@resend.dev>",
        to: ["holakumar2@gmail.com"],
        reply_to: data.email,
        subject: `New TAMTA Studios enquiry — ${project}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1d1d1f">
            <h1 style="font-size:28px;margin-bottom:8px">New TAMTA Studios enquiry</h1>
            <p style="color:#6e6e73">Someone submitted the enquiry form on TAMTA Studios.</p>
            <hr style="border:0;border-top:1px solid #ddd;margin:24px 0" />
            <p><strong>Name</strong><br/>${escapeHtml(data.name)}</p>
            <p><strong>Email</strong><br/>${escapeHtml(data.email)}</p>
            <p><strong>Project</strong><br/>${escapeHtml(project)}</p>
            <p><strong>Brief</strong><br/>${escapeHtml(brief).replace(/\n/g, "<br/>")}</p>
          </div>
        `,
      }),
    });

    const notificationResult = await notificationResponse.json();

    if (!notificationResponse.ok) {
      console.error("Resend notification error", notificationResult);
      return NextResponse.json(
        { ok: false, message: "We couldn't send your enquiry right now." },
        { status: 502 },
      );
    }

    // Automatic acknowledgement to the person who submitted the enquiry.
    // This is intentionally sent only after the owner's notification succeeds.
    const acknowledgementResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: resendHeaders,
      body: JSON.stringify({
        from: "TAMTA Studios <onboarding@resend.dev>",
        to: [data.email],
        reply_to: "holakumar2@gmail.com",
        subject: "Welcome to TAMTA Studios — We've received your enquiry",
        html: acknowledgementEmail(data.name),
      }),
    });

    const acknowledgementResult = await acknowledgementResponse.json();

    if (!acknowledgementResponse.ok) {
      // The enquiry notification has already succeeded, so don't tell the client
      // that their enquiry failed. Log the acknowledgement failure for debugging.
      console.error("Resend acknowledgement error", acknowledgementResult);
    }

    console.log("TAMTA enquiry emails", {
      notificationId: notificationResult?.id,
      acknowledgementId: acknowledgementResult?.id,
      acknowledgementSent: acknowledgementResponse.ok,
    });

    return NextResponse.json({ ok: true, message: "Enquiry received" }, { status: 201 });
  } catch (error) {
    console.error("TAMTA enquiry error", error);
    return NextResponse.json(
      { ok: false, message: "Please check your enquiry details." },
      { status: 400 },
    );
  }
}

function acknowledgementEmail(name: string) {
  return `
    <div style="margin:0;background:#f5f5f7;padding:40px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1d1d1f">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:28px;padding:48px 42px;box-shadow:0 10px 40px rgba(0,0,0,.06)">
        <div style="text-align:center;margin-bottom:42px">
          <div style="display:inline-block;font-size:20px;line-height:1;font-weight:700;letter-spacing:3px;color:#111111">TAMTA</div>
          <div style="margin-top:8px;font-size:11px;letter-spacing:2px;color:#86868b;text-transform:uppercase">Studios</div>
        </div>

        <h1 style="font-size:30px;line-height:1.2;font-weight:600;letter-spacing:-.7px;margin:0 0 24px">Welcome to TAMTA Studios.</h1>
        <p style="font-size:16px;line-height:1.7;margin:0 0 18px">Hi ${escapeHtml(name)},</p>
        <p style="font-size:16px;line-height:1.7;color:#424245;margin:0 0 18px">Thank you for getting in touch with <strong style="color:#1d1d1f">TAMTA Studios</strong>.</p>
        <p style="font-size:16px;line-height:1.7;color:#424245;margin:0 0 18px">We've received your enquiry and will take a look at your project. We'll get back to you as soon as possible.</p>
        <p style="font-size:16px;line-height:1.7;color:#424245;margin:0 0 36px">If you have any additional details, references, or ideas you'd like to share, feel free to reply to this email.</p>

        <div style="border-top:1px solid #e5e5e7;padding-top:28px">
          <p style="font-size:15px;line-height:1.6;margin:0;color:#1d1d1f">Kind regards,</p>
          <p style="font-size:15px;line-height:1.6;font-weight:600;margin:4px 0 2px">TAMTA Studios</p>
          <p style="font-size:14px;line-height:1.6;font-style:italic;color:#6e6e73;margin:0">Where ideas become stories.</p>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
