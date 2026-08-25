"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function EnquiryPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="page">
      <style>{`
        *{box-sizing:border-box}html{background:#f5f5f7}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#1d1d1f}.page{min-height:100vh;background:#f5f5f7}.nav{height:64px;border-bottom:1px solid #ddd;display:flex;align-items:center;justify-content:space-between;padding:0 5vw;position:sticky;top:0;background:#f5f5f7ee;backdrop-filter:blur(18px);z-index:5}.brand{font-size:14px;font-weight:700;letter-spacing:.08em}.brand span{font-weight:400}.back{font-size:12px;color:#6e6e73}.wrap{width:min(1120px,90%);margin:auto;padding:90px 0 110px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:start}.eyebrow{font-size:11px;color:#6e6e73;letter-spacing:.12em;text-transform:uppercase;margin-bottom:18px}.title{font-size:clamp(54px,8vw,96px);line-height:.94;letter-spacing:-.06em;margin:0 0 25px;font-weight:600}.intro{font-size:18px;line-height:1.6;color:#6e6e73;max-width:480px}.note{margin-top:55px;font-size:13px;color:#6e6e73;line-height:1.7;max-width:420px}.form{display:grid;gap:14px;background:#fff;border-radius:22px;padding:30px;box-shadow:0 20px 70px #0000000d}.form label{font-size:11px;color:#6e6e73;margin-top:4px}.form input,.form textarea,.form select{width:100%;border:1px solid #d2d2d7;background:#f8f8fa;border-radius:10px;padding:15px;color:#1d1d1f;outline:none}.form textarea{min-height:160px;resize:vertical}.form input:focus,.form textarea:focus,.form select:focus{border-color:#777}.submit{border:0;border-radius:999px;background:#1d1d1f;color:#fff;padding:14px 22px;justify-self:start;cursor:pointer}.status{font-size:13px}.success{color:#248a3d}.error{color:#c93434}@media(max-width:800px){.wrap{padding:60px 0}.grid{grid-template-columns:1fr;gap:45px}.title{font-size:58px}.form{padding:22px}}
      `}</style>
      <nav className="nav">
        <Link className="brand" href="/">TAMTA <span>STUDIOS</span></Link>
        <Link className="back" href="/">← Back to studio</Link>
      </nav>
      <div className="wrap">
        <div className="grid">
          <div>
            <div className="eyebrow">TAMTA Studios · Enquiry</div>
            <h1 className="title">Let's make something worth watching.</h1>
            <p className="intro">Have a film, campaign, photograph or visual idea in mind? Tell us what you're imagining. We'll take it from there.</p>
            <p className="note">No formal brief required. A rough idea, reference, mood or even a few words is enough to start a conversation.</p>
          </div>
          <form className="form" onSubmit={submit}>
            <label>Name</label>
            <input name="name" placeholder="Your name" required />
            <label>Email</label>
            <input name="email" type="email" placeholder="you@example.com" required />
            <label>What are you making?</label>
            <select name="project" defaultValue="" required>
              <option value="" disabled>Select a project type</option>
              <option>Film / Brand Film</option>
              <option>Advertising Campaign</option>
              <option>Photography</option>
              <option>Motion / Post</option>
              <option>Something experimental</option>
              <option>Other</option>
            </select>
            <label>Tell us about it</label>
            <textarea name="message" placeholder="Tell us the idea, mood, timeline or anything you already know..." required minLength={10} />
            <button className="submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry →"}</button>
            {status === "success" && <div className="status success">✓ Enquiry received. We'll be in touch.</div>}
            {status === "error" && <div className="status error">Something went wrong. Please try again.</div>}
          </form>
        </div>
      </div>
    </main>
  );
}
