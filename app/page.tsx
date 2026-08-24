"use client";
import { FormEvent, useState } from "react";

const work = [
  ["01", "The Last Light", "Brand Film · 2026"],
  ["02", "After Dark", "Commercial · 2026"],
  ["03", "Made of Moments", "Campaign · 2026"],
  ["04", "Quiet Luxury", "Photography · 2026"],
];
const services = [
  ["Film", "Brand films, commercials and narrative production."],
  ["Advertising", "Campaigns built around a sharp creative idea."],
  ["Photography", "Editorial, product and cinematic stills."],
  ["Post", "Editing, colour, sound and motion finishing."],
];

export default function Home() {
  const [sent, setSent] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    setSent(res.ok);
  }
  return <main>
    <nav className="nav"><div className="shell navin"><a className="brand" href="#top">TAMTA STUDIOS</a><div className="navlinks"><a href="#work">Work</a><a href="#services">Services</a><a href="#contact">Start a project</a></div></div></nav>
    <section className="hero" id="top"><div className="shell"><div className="eyebrow">Creative cinematic studio · India</div><h1>Stories,<br/>engineered as<br/><em>experiences.</em></h1><p>We make films, advertising and visual worlds that don't just show a story — they make you feel it.</p><div className="actions"><a className="btn primary" href="#contact">Start a project ↗</a><a className="btn" href="#work">Explore the work</a></div></div></section>
    <section id="work"><div className="shell"><div className="sectionhead"><h2>Selected work</h2><p>A small selection of imagined and upcoming studio work. The final portfolio will become a living archive of every story we create.</p></div><div className="workgrid">{work.map(([n,t,d])=><article className="card" key={n}><span className="num">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
    <section id="services"><div className="shell"><div className="sectionhead"><h2>What we make</h2><p>From the first idea to the final frame, we bring creative direction and production together.</p></div><div className="services">{services.map(([t,d])=><div className="service" key={t}><b>{t}</b><p>{d}</p></div>)}</div></div></section>
    <section><div className="shell"><div className="eyebrow">The studio philosophy</div><div className="manifesto">The richest stories aren't watched. They stay with you.</div></div></section>
    <section id="contact"><div className="shell contact"><div><div className="eyebrow">Start something</div><h2>Tell us what<br/>you're imagining.</h2></div><form className="form" onSubmit={submit}><input name="name" placeholder="Your name" required/><input name="email" type="email" placeholder="Email" required/><input name="company" placeholder="Company / brand"/><textarea name="brief" placeholder="Tell us about the project, timeline and budget..." required/><button className="btn primary" type="submit">{sent ? "Enquiry received ✓" : "Send enquiry →"}</button></form></div></section>
    <footer className="shell footer"><b>TAMTA STUDIOS</b><span>Films · Ads · Photography · Visual experiences</span></footer>
  </main>;
}