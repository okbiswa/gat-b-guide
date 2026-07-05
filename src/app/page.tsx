import { getInstitutes } from "@/utils/dataStore";
import { MapPin, Award, GraduationCap, ArrowRight } from "lucide-react";
import { IntelligentSearch } from "@/components/IntelligentSearch";

// Custom prestige ranking from the prompt
const PRESTIGE_RANKING = [
  "Jawaharlal Nehru University",
  "IIT Indore",
  "University of Hyderabad",
  "Regional Centre for Biotechnology",
  "Rajiv Gandhi Centre for Biotechnology",
  "Banaras Hindu University",
  "Savitribai Phule Pune University",
  "NIT Durgapur",
  "Pondicherry University",
  "PGIMER"
];

export default async function Home() {
  const allInstitutes = getInstitutes();
  
  // Rank institutes
  const rankedInstitutes = [...allInstitutes].sort((a, b) => {
    const rankA = PRESTIGE_RANKING.findIndex(name => a.institute_name.includes(name));
    const rankB = PRESTIGE_RANKING.findIndex(name => b.institute_name.includes(name));
    
    if (rankA !== -1 && rankB !== -1) return rankA - rankB;
    if (rankA !== -1) return -1;
    if (rankB !== -1) return 1;
    return 0; // Keep original order for the rest
  });

  const displayInstitutes = rankedInstitutes.slice(0, 12);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <GraduationCap size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">GAT-B Guide</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <a href="/explorer" className="hover:text-blue-600 transition-colors">Institutes</a>
            <a href="/explorer" className="hover:text-blue-600 transition-colors">Cutoffs</a>
            <a href="/explorer" className="hover:text-blue-600 transition-colors">Programs</a>
            <a href="/explorer" className="hover:text-blue-600 transition-colors">Seat Matrix</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            AI Admission Advisor Now Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight max-w-4xl">
            Find Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">GAT-B</span> Institute
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10">
            Browse through {allInstitutes.length} top biotechnology institutes across India. Use our AI Agent in the bottom right corner for personalized cutoff predictions.
          </p>
          
          <IntelligentSearch />
        </div>
      </section>

      {/* Institutes Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">Featured Institutes</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayInstitutes.map((institute) => (
            <div key={institute.institute_id} className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition-all duration-300">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:scale-110 transition-transform">
                    {institute.institute_name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
                    {institute.degree_type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1">
                  {institute.institute_name}
                </h3>
                
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                  {institute.programme_offered}
                </p>
                
                <div className="mt-auto space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <MapPin size={16} className="text-zinc-400" />
                    <span>{institute.city}, {institute.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Award size={16} className="text-zinc-400" />
                    <span>{institute.total_seats} Total Seats</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500">{institute.broad_field}</span>
                <a 
                  href={institute.admissions_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Visit Site &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
