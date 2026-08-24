import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const valid = secret && signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return new NextResponse('invalid signature', { status: 400 });
  return NextResponse.json({ received: true });
}
