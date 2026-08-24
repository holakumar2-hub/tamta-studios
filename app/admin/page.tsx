import { db } from '@/lib/prisma';

export default async function Admin() {
  const enquiries = await db.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return <main className="wrap" style={{ paddingTop: 100 }}><div className="eyebrow">TAMTA STUDIOS / ADMIN</div><h1 style={{ fontFamily: 'Georgia,serif', fontSize: 64 }}>Enquiries</h1>{enquiries.map(e => <div key={e.id} className="card" style={{ minHeight: 0, margin: '12px 0' }}><span className="eyebrow">{e.status} · {e.service}</span><h3>{e.name} — {e.company || 'Independent'}</h3><p className="muted">{e.email} · {e.phone || 'No phone'} · {e.budget || 'Budget not given'} · {e.timeline || 'Timeline not given'}</p><p>{e.message}</p></div>)}</main>;
}
