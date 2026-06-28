export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-800 h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
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
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-48" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-64" />
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-28" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-36" />
          <div className="bg-white dark:bg-slate-900 h-64 border border-slate-200 dark:border-slate-800 rounded-xl" />
        </div>
        <div className="space-y-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-36" />
          <div className="bg-white dark:bg-slate-900 h-64 border border-slate-200 dark:border-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CollegeDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-800 h-96 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
          <div className="space-y-3 pt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-5/6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl h-80 space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
}
