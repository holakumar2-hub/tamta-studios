"use client";
import { useState } from "react";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }

export default function PayPage() {
  const [loading, setLoading] = useState(false), [message, setMessage] = useState("");
  async function start() {
    setLoading(true); setMessage("");
    try {
      const r = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: 5000 }) });
      const data = await r.json(); if (!r.ok) throw new Error(data.message);
      if (!window.Razorpay) { await new Promise<void>((resolve, reject) => { const s = document.createElement("script"); s.src = "https://checkout.razorpay.com/v1/checkout.js"; s.onload = () => resolve(); s.onerror = () => reject(new Error("Could not load payment checkout.")); document.body.appendChild(s); }); }
      const Checkout = window.Razorpay; if (!Checkout) throw new Error("Payment checkout unavailable.");
      new Checkout({ key: data.keyId, amount: 500000, currency: "INR", name: "TAMTA Studios", description: "Creative consultation deposit", order_id: data.orderId, theme: { color: "#d5b477" }, handler: () => setMessage("Payment received. We'll be in touch with the next production step.") }).open();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Payment setup is not available yet."); } finally { setLoading(false); }
  }
  return <main className="project-page"><div className="project-copy" style={{minHeight:"100vh",alignItems:"center"}}><div><div className="eyebrow">TAMTA / Production</div><h2>Reserve a creative consultation.</h2><p style={{color:"var(--muted)",lineHeight:1.8}}>A ₹5,000 consultation deposit. Payment keys stay server-side; checkout is opened securely in the browser.</p><button className="btn primary" onClick={start} disabled={loading}>{loading ? "Preparing…" : "Continue to secure payment →"}</button>{message && <p style={{color:"#d6b98a",marginTop:20}}>{message}</p>}</div></div></main>;
}
