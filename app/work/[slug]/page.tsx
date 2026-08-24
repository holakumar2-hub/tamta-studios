import Link from "next/link";

const projects: Record<string, { title: string; type: string; year: string; image: string; description: string }> = {
  "the-last-light": { title: "The Last Light", type: "Brand Film", year: "2026", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2400&q=90", description: "A cinematic brand story built around atmosphere, restraint and the final moment of daylight." },
  "after-dark": { title: "After Dark", type: "Commercial", year: "2026", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2400&q=90", description: "A nocturnal visual language for a campaign designed to feel immediate, tactile and cinematic." },
  "made-of-moments": { title: "Made of Moments", type: "Campaign", year: "2026", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=90", description: "A campaign world where everyday spaces become emotional frames." },
  "quiet-luxury": { title: "Quiet Luxury", type: "Photography", year: "2026", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2400&q=90", description: "Editorial photography focused on texture, light and understated visual elegance." },
};

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects[slug] ?? projects["the-last-light"];
  return <main className="project-page"><Link className="project-back" href="/#work">← Back to work</Link><div className="project-hero" style={{ backgroundImage: `linear-gradient(0deg,#080808 0%,transparent 55%),url(${project.image})` }}><div className="project-title"><small>{project.type} · {project.year}</small><h1>{project.title}</h1></div></div><section className="project-copy"><div className="eyebrow">TAMTA / Project</div><h2>{project.description}</h2><Link className="btn primary" href="/#contact">Create something like this ↗</Link></section></main>;
}
