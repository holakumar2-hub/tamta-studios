"use client";
import { FormEvent, useState } from "react";

const work = [
  ["01", "The Last Light", "Brand Film · 2026", "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=85"],
  ["02", "After Dark", "Commercial · 2026", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85"],
  ["03", "Made of Moments", "Campaign · 2026", "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85"],
  ["04", "Quiet Luxury", "Photography · 2026", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85"],
];
const services = [["Film", "Brand films, commercials and narrative production."],["Advertising", "Campaigns built around a sharp creative idea."],["Photography", "Editorial, product and cinematic stills."],["Post", "Editing, colour, sound and motion finishing."]];

export default function Home() {
  const [sent, setSent] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = new FormData(e.currentTarget); const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) }); setSent(res.ok); }
  return <main>
    <nav className="nav"><div className="shell navin"><a className="brand" href="#top">TAMTA STUDIOS</a><div className="navlinks"><a href="#work">Work</a><a href="#services">Services</a><a href="#contact">Start a project</a></div></div></nav>
    <section className="hero" id="top"><div className="hero-image"/><div className="hero-overlay"/><div className="shell hero-content"><div className="eyebrow">Creative cinematic studio · India</div><h1>Stories,<br/>engineered as<br/><em>experiences.</em></h1><p>Films, advertising and visual worlds made to be felt — not simply watched.</p><div className="actions"><a className="btn primary" href="#contact">Start a project ↗</a><a className="btn glass" href="#work">Explore the work</a></div></div><div className="scroll">SCROLL TO EXPLORE ↓</div></section>
    <section className="intro"><div className="shell intro-grid"><div className="eyebrow">01 / The studio</div><div><h2>We create visual experiences with a cinematic soul.</h2><p>From a single frame to an entire campaign, TAMTA Studios brings story, atmosphere and craft together.</p></div></div></section>
    <section id="work"><div className="shell"><div className="sectionhead"><div><div className="eyebrow">02 / Selected work</div><h2>Frames that linger.</h2></div><p>Stories built through light, composition, movement and emotion.</p></div><div className="workgrid">{work.map(([n,t,d,img])=><article className="card" key={n} style={{backgroundImage:`url(${img})`}}><div className="cardshade"/><div className="cardcontent"><span className="num">{n}</span><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></section>
    <section id="services"><div className="shell"><div className="sectionhead"><div><div className="eyebrow">03 / Capabilities</div><h2>Made from idea<br/>to final frame.</h2></div><p>Creative direction and production under one roof.</p></div><div className="services">{services.map(([t,d],i)=><div className="service" key={t}><span>0{i+1}</span><b>{t}</b><p>{d}</p><i>↗</i></div>)}</div></div></section>
    <section className="statement"><div className="shell"><div className="eyebrow">04 / Philosophy</div><div className="manifesto">The richest stories aren't watched.<br/><em>They stay with you.</em></div></div></section>
    <section id="contact"><div className="shell contact"><div><div className="eyebrow">05 / Start something</div><h2>Tell us what<br/><em>you're imagining.</em></h2><p>Have a film, campaign or visual world in mind? Let's make the first frame.</p></div><form className="form" onSubmit={submit}><input name="name" placeholder="Your name" required/><input name="email" type="email" placeholder="Email" required/><input name="company" placeholder="Company / brand"/><textarea name="brief" placeholder="Tell us about the project, timeline and budget..." required/><button className="btn primary" type="submit">{sent ? "Enquiry received ✓" : "Send enquiry →"}</button></form></div></section>
    <footer className="shell footer"><b>TAMTA STUDIOS</b><span>Films · Ads · Photography · Visual experiences</span><span>© 2026</span></footer>
  </main>;
}