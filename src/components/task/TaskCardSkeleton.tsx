export function TaskCardSkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-44 w-full bg-[#1E293B] border border-slate-800 rounded-xl p-5 animate-pulse flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-5 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-full" />
            <div className="h-3 bg-slate-800 rounded w-5/6" />
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-6 bg-slate-800 rounded w-16" />
            <div className="h-7 w-7 bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}