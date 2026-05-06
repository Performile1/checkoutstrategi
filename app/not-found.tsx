import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-prose py-24 text-center">
      <p className="badge">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Sidan hittades inte</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">Länken kan vara felstavad eller sidan flyttad.</p>
      <Link href="/" className="btn-primary mt-6">Till startsidan</Link>
    </section>
  );
}
