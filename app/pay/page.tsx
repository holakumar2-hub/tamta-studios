"use client";
import { useState } from "react";

export default function PayPage() {
  const [loading, setLoading] = useState(false), [message, setMessage] = useState("");
  async function start() {
    setLoading(true); setMessage("");
    try { const r = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: 5000 }) }); const data = await r.json(); if (!r.ok) throw new Error(data.message); if (data.checkoutUrl) window.location.href = data.checkoutUrl; else setMessage(data.message); } catch (e) { setMessage(e instanceof Error ? e.message : "Payment setup is not available yet."); } finally { setLoading(false); }
  }
  return <main className="project-page"><div className="project-copy" style={{minHeight:"100vh",alignItems:"center"}}><div><div className="eyebrow">TAMTA / Production</div><h2>Reserve a creative consultation.</h2><p style={{color:"var(--muted)",lineHeight:1.8}}>A ₹5,000 consultation deposit can be connected to your preferred payment provider. It is kept behind a server-side API and never exposes payment secrets in the browser.</p><button className="btn primary" onClick={start} disabled={loading}>{loading ? "Preparing…" : "Continue to secure payment →"}</button>{message && <p style={{color:"#d6b98a",marginTop:20}}>{message}</p>}</div></div></main>;
}
