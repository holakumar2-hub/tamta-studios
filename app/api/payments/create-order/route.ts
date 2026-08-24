import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  const { amount, enquiryId } = await req.json();
  if (!amount) return NextResponse.json({ error: 'amount required' }, { status: 400 });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 503 });
  const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: 'INR', receipt: enquiryId || `tamta_${Date.now()}` });
  return NextResponse.json({ orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID });
}
