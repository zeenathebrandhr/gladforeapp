import { Link } from "wouter";

export default function Landing() {
  const farmersCount = 1234;
  const fertilizersGiven = 4567;

  const testimonials = [
    {
      name: "Amina",
      quote:
        "Gladfore's input credit helped me buy fertilizer when I needed it most. Harvest was better and I paid back on time.",
    },
    {
      name: "Kofi",
      quote:
        "The agents were helpful and the 50:50 credit made it easy to access quality inputs without upfront full payment.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Gladfore</h1>
          <nav className="space-x-4">
            <Link href="/login" className="text-sm text-slate-700 dark:text-slate-200">Sign in</Link>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Grow with confidence — 50:50 input credit</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
              Gladfore partners with smallholder farmers to provide fertilizer on a 50:50 credit.
              Farmers pay 50% upfront and the remainder after harvest at an agreed date — making quality inputs accessible when they matter.
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="inline-block w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</span>
                <span className="text-slate-700 dark:text-slate-200">Pay only half upfront — the rest after harvest.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center">★</span>
                <span className="text-slate-700 dark:text-slate-200">Agents earn commission for curating qualified farmers.</span>
              </li>
            </ul>

            <div className="flex gap-4">
              <Link href="/login?role=farmer" className="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-95">Join as a farmer</Link>
              <Link href="/login?role=agent" className="px-4 py-2 border border-slate-300 rounded-md text-slate-800 hover:bg-slate-50">Join as an agent</Link>
            </div>
          </div>

          <aside className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-sm text-slate-500">Our impact</h3>
              <div className="flex items-baseline gap-4 mt-3">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{farmersCount.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">farmers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{fertilizersGiven.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">fertilizers given</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm text-slate-500 mb-3">Testimonials</h4>
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <blockquote key={t.name} className="p-3 rounded-md bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-200">“{t.quote}”</p>
                    <footer className="text-xs text-slate-500 mt-2">— {t.name}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Agents: Earn while you help</h3>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            As an agent, you represent Gladfore in your area. You help identify farmers who qualify for our 50:50 credit,
            assist with onboarding, and earn commission when contracts are successful and repaid.
          </p>
          <div className="text-sm text-slate-600 dark:text-slate-300">Ready to join? Sign up above or contact our team to learn more.</div>
        </section>
      </div>
    </main>
  );
}