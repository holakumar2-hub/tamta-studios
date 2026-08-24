import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), company: z.string().optional(), brief: z.string().min(10) });

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    console.log("TAMTA enquiry", { ...data, receivedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, message: "Enquiry received" }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, message: "Please check your enquiry details." }, { status: 400 });
  }
}