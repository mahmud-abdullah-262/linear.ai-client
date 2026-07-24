import type { CurrentUser } from '@/types/dashboard';

interface FilterBarProps {
  currentUser: CurrentUser;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedPriority: string;
  onPriorityChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  allTags: string[];
  sortBy: 'latest' | 'priority';
  onSortChange: (value: 'latest' | 'priority') => void;
}

export function FilterBar({
  currentUser,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedTag,
  onTagChange,
  allTags,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="border-b border-slate-800/80 backdrop-blur-md shrink-0 px-6 py-4 bg-[#0B0F19]/80">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse" />
            Member Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your tasks and collaborate with the AI assistant. (Signed in as:{' '}
            <strong className="text-[#06B6D4]">{currentUser.name}</strong> - {currentUser.role})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search title, description..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-lg py-1.5 pl-8 pr-3 text-xs text-[#F8FAFC] placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all"
            />
            <span className="absolute left-2.5 top-2.5 text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-2 py-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0B0F19]">All</option>
              <option value="Critical" className="bg-[#0B0F19]">Critical</option>
              <option value="High" className="bg-[#0B0F19]">High</option>
              <option value="Medium" className="bg-[#0B0F19]">Medium</option>
              <option value="Low" className="bg-[#0B0F19]">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-2 py-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => onTagChange(e.target.value)}
              className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0B0F19]">All</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag} className="bg-[#0B0F19]">
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0B0F19] border border-slate-700/80 rounded-lg px-2 py-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'latest' | 'priority')}
              className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none cursor-pointer"
            >
              <option value="latest" className="bg-[#0B0F19]">Latest Created</option>
              <option value="priority" className="bg-[#0B0F19]">Priority Level</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}