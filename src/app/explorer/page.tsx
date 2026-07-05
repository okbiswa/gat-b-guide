import { getInstitutes, getCutoffs } from "@/utils/dataStore";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Explorer() {
  const institutes = getInstitutes();
  const cutoffs = getCutoffs();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans">
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <GraduationCap size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">GAT-B Data Explorer</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Raw Data Explorer</h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-3xl">
            This is the raw data explorer for power users. However, we highly recommend using the AI Admission Advisor on the homepage to find your best matches automatically!
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-200">Institutes Database ({institutes.length})</h2>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
                <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-xs uppercase font-semibold text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Programme</th>
                    <th className="px-6 py-4">Seats</th>
                    <th className="px-6 py-4">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {institutes.slice(0, 100).map((inst) => (
                    <tr key={inst.institute_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-6 py-4 font-mono text-xs">{inst.institute_id}</td>
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{inst.institute_name}</td>
                      <td className="px-6 py-4">{inst.programme_offered}</td>
                      <td className="px-6 py-4">{inst.total_seats}</td>
                      <td className="px-6 py-4">{inst.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
