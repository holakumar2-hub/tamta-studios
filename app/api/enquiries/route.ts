import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.service) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    const enquiry = await db.enquiry.create({ data: { name: body.name, email: body.email, phone: body.phone, company: body.company, service: body.service, budget: body.budget, timeline: body.timeline, message: body.message } });
    return NextResponse.json({ ok: true, id: enquiry.id });
  } catch {
    return NextResponse.json({ error: 'Unable to save enquiry' }, { status: 500 });
  }
}
