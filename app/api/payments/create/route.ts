import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ amount: z.number().int().positive().max(500000) });

export async function POST(request: Request) {
  try {
    const { amount } = schema.parse(await request.json());
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return NextResponse.json({ ok: false, message: "Payment provider keys are not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel environment variables." }, { status: 503 });
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount: amount * 100, currency: "INR", receipt: `tamta_${Date.now()}`, notes: { purpose: "TAMTA creative consultation" } }) });
    const order = await response.json();
    if (!response.ok) return NextResponse.json({ ok: false, message: "Payment provider rejected the order." }, { status: 502 });
    return NextResponse.json({ ok: true, orderId: order.id, keyId });
  } catch { return NextResponse.json({ ok: false, message: "Unable to create payment order." }, { status: 400 }); }
}
