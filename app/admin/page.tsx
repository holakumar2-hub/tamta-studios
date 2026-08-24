import { db } from '@/lib/prisma';

export default async function Admin() {
  const enquiries = await db.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return <main className="wrap" style={{ paddingTop: 100 }}><div className="eyebrow">TAMTA STUDIOS / ADMIN</div><h1 style={{ fontFamily: 'Georgia,serif', fontSize: 64 }}>Enquiries</h1>{enquiries.map((enquiry) => <div key={enquiry.id} className="card" style={{ minHeight: 0, margin: '12px 0' }}><span className="eyebrow">{enquiry.status} · {enquiry.service}</span><h3>{enquiry.name} — {enquiry.company || 'Independent'}</h3><p className="muted">{enquiry.email} · {enquiry.phone || 'No phone'} · {enquiry.budget || 'Budget not given'} · {enquiry.timeline || 'Timeline not given'}</p><p>{enquiry.message}</p></div>)}</main>;
}
