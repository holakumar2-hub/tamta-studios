"use client";
import { FormEvent, useState } from "react";

type Message = { role: "assistant" | "user"; text: string };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Hi. I'm TAMTA Concierge. Tell me what you're creating — film, campaign, photography, or something unusual." }]);
  const [busy, setBusy] = useState(false);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply ?? "I can help with a project enquiry." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I couldn't reach the concierge right now. Please use Start a project below." }]);
    } finally { setBusy(false); }
  }

  return <>
    <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Open TAMTA Concierge">{open ? "×" : "✦"}<span>{open ? "Close" : "Concierge"}</span></button>
    {open && <aside className="chat-panel" aria-label="TAMTA Concierge">
      <div className="chat-head"><div><small>TAMTA / AI CONCIERGE</small><b>Let's shape the brief.</b></div><button onClick={() => setOpen(false)}>×</button></div>
      <div className="chat-body">{messages.map((m, i) => <div key={i} className={`chat-msg ${m.role}`}>{m.text}</div>)}{busy && <div className="chat-msg assistant">Thinking…</div>}</div>
      <form className="chat-form" onSubmit={send}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me about your idea…"/><button>→</button></form>
    </aside>}
  </>;
}
