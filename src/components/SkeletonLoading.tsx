export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="shimmer h-48 w-full" />
      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 shimmer rounded-lg w-1/3" />
            <div className="h-4.5 shimmer rounded-lg w-1/4" />
          </div>
          <div className="h-7 shimmer rounded-lg w-3/4" />
          <div className="h-4 shimmer rounded-lg w-1/2" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
          <div className="h-5 shimmer rounded-lg w-1/4" />
          <div className="h-9 shimmer rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 shimmer rounded-lg w-48" />
          <div className="h-4.5 shimmer rounded-lg w-64" />
        </div>
        <div className="h-10 shimmer rounded-xl w-28" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-2xl space-y-3">
            <div className="h-4 shimmer rounded-lg w-1/3" />
            <div className="h-9 shimmer rounded-lg w-1/2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 shimmer rounded-lg w-36" />
          <div className="h-72 border border-slate-250/60 dark:border-slate-900 rounded-2xl shimmer" />
        </div>
        <div className="space-y-6">
          <div className="h-6 shimmer rounded-lg w-36" />
          <div className="h-72 border border-slate-250/60 dark:border-slate-900 rounded-2xl shimmer" />
        </div>
      </div>
    </div>
  );
}

export function CollegeDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-80 w-full rounded-3xl shimmer" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 shimmer rounded-lg w-3/4" />
          <div className="h-5 shimmer rounded-lg w-1/4" />
          <div className="space-y-3 pt-4">
            <div className="h-4.5 shimmer rounded-lg w-full" />
            <div className="h-4.5 shimmer rounded-lg w-full" />
            <div className="h-4.5 shimmer rounded-lg w-5/6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-2xl h-80 space-y-4">
          <div className="h-6 shimmer rounded-lg w-1/2" />
          <div className="h-8 shimmer rounded-lg w-3/4" />
          <div className="h-10 shimmer rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
