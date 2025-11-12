interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        animation: "shimmer 2s infinite",
        ...style,
      }}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="glass rounded-2xl shadow-lg p-6 border border-white/20">
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-10 w-32 mb-3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4 mt-1" />
    </div>
  );
}

export function ChartSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div className="glass rounded-2xl shadow-lg p-8 border border-white/20">
      <div className="mb-6">
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}

export function FilterPanelSkeleton() {
  return (
    <div className="glass rounded-xl shadow-lg p-6 border border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
