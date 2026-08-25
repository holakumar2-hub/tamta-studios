"use client";
import { FormEvent, useState } from "react";

type Message = { role: "assistant" | "user"; text: string };

const welcome = `Welcome to TAMTA Studios. How may I help you?\n\nWe create films, advertising, photography and motion — from the first idea through the final frame.\n\nYou can ask me about our services, creative direction, production, timelines, budgets, or tell me about something you want to make.`;

const starterPrompts = ["What does TAMTA Studios offer?", "I have an advertising idea", "I need a cinematic film"];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: welcome }]);
  const [busy, setBusy] = useState(false);

  async function send(e?: FormEvent, preset?: string) {
    e?.preventDefault();
    const text = (preset ?? input).trim();
    if (!text || busy) return;
    setInput("");
    const nextMessages = [...messages, { role: "user" as const, text }];
    setMessages(nextMessages);
    setBusy(true);
    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-16) }),
      });
      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply ?? "I can help with a project enquiry." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I couldn't reach the concierge right now. Please try again or use Start a project below." }]);
    } finally {
      setBusy(false);
    }
  }

  return <>
    <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Open TAMTA Concierge">{open ? "×" : "✦"}<span>{open ? "Close" : "Concierge"}</span></button>
    {open && <aside className="chat-panel" aria-label="TAMTA Concierge" style={{ borderRadius: 28, overflow: "hidden" }}>
      <div className="chat-head" style={{ borderRadius: "28px 28px 0 0" }}>
        <div><small>TAMTA / AI CONCIERGE</small><b>Let's shape the brief.</b></div>
        <button onClick={() => setOpen(false)} aria-label="Close concierge">×</button>
      </div>
      <div className="chat-body">
        {messages.map((m, i) => <div key={i} className={`chat-msg ${m.role}`} style={{ borderRadius: 20, whiteSpace: "pre-line" }}>{m.text}</div>)}
        {messages.length === 1 && !busy && <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 2 }}>
          {starterPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => send(undefined, prompt)} style={{ border: "1px solid #37322c", background: "#111", color: "#d8d1c7", borderRadius: 999, padding: "9px 12px", fontSize: 10, cursor: "pointer" }}>{prompt}</button>)}
        </div>}
        {busy && <div className="chat-msg assistant" style={{ borderRadius: 20 }}>Thinking…</div>}
      </div>
      <form className="chat-form" onSubmit={send}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell me about your idea…"/>
        <button aria-label="Send message">→</button>
      </form>
    </aside>}
  </>;
}
