'use client';
import { useState } from 'react';

export default function Home() {
  const [sent, setSent] = useState(false);
  const [chat, setChat] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(f)) });
    setSent(r.ok);
  }

  function ask() {
    if (!input.trim()) return;
    setMessages([...messages, `You: ${input}`, `TAMTA AI: I can help scope your project. Tell me your service, timeline and approximate budget, and I’ll prepare an enquiry.`]);
    setInput('');
  }

  return <>
    <nav className="nav"><div className="brand">TAMTA STUDIOS</div><div className="navlinks"><a href="#work">Work</a><a href="#services">Services</a><a href="#enquire">Start a project</a></div></nav>
    <main>
      <section className="hero"><div className="wrap"><div className="eyebrow">Creative cinematic studio · India</div><h1>Stories become<br/><i>experiences.</i></h1><p>Film, advertising, photography and visual craft designed to make people feel something before they understand why.</p><a className="cta" href="#enquire">Start a project ↗</a></div></section>
      <section className="section" id="work"><div className="wrap"><h2>Selected work.</h2><div className="grid"><div className="project"><div><span className="eyebrow">01 · Brand Film</span><h3>After the Light</h3></div></div><div className="project"><div><span className="eyebrow">02 · Advertising</span><h3>The Scent of Memory</h3></div></div><div className="project"><div><span className="eyebrow">03 · Photography</span><h3>Still / Moving</h3></div></div></div></div></section>
      <section className="section" id="services"><div className="wrap"><h2>What we create.</h2><div className="grid">{['Film Production','Advertising','Brand Films','Photography','Post Production','Creative Direction'].map((x,i)=><div className="card" key={x}><span className="eyebrow">0{i+1}</span><h3>{x}</h3><p className="muted">From concept to final frame, built around the feeling the audience should leave with.</p></div>)}</div></div></section>
      <section className="section" id="enquire"><div className="wrap"><h2>Tell us your story.</h2>{sent ? <p className="muted">Thank you. Your enquiry is in our system. We’ll be in touch.</p> : <form className="form" onSubmit={submit}><input name="name" placeholder="Your name" required/><input name="email" type="email" placeholder="Email" required/><input name="phone" placeholder="Phone / WhatsApp"/><input name="company" placeholder="Company / brand"/><select name="service" defaultValue=""><option value="" disabled>What do you need?</option><option>Film Production</option><option>Advertising</option><option>Brand Film</option><option>Photography</option><option>Post Production</option><option>Creative Direction</option></select><input name="budget" placeholder="Approx. budget"/><input name="timeline" placeholder="Desired timeline"/><textarea name="message" placeholder="Tell us about the project..."/><button className="cta" type="submit">Send enquiry ↗</button></form>}</div></section>
    </main>
    <footer className="footer"><div className="wrap">TAMTA STUDIOS · Stories become experiences.</div></footer>
    <button onClick={() => setChat(!chat)} className="chat-button">TAMTA AI</button>
    {chat && <div className="chat-panel"><b>Creative Assistant</b><div className="chat-messages">{messages.join('\n\n') || 'Tell me what you want to create.'}</div><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Ask about a project..."/></div>}
  </>;
}
