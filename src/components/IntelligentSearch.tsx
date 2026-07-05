'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export function IntelligentSearch() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Dispatch custom event to open the chat window
    window.dispatchEvent(new CustomEvent('open-ai-chat', { 
      detail: { query } 
    }));
    
    setQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400 group-focus-within:text-blue-500 transition-colors">
        <Search size={20} />
      </div>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
        placeholder="e.g. Best MSc Genetics colleges in North India"
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 rounded-xl font-medium transition-colors"
        >
          Ask AI
        </button>
      </div>
    </form>
  );
}
