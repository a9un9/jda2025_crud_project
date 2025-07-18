// components/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 bg-gray-300 rounded w-1/4" />
            <div className="h-4 bg-gray-300 rounded w-1/4" />
            <div className="h-4 bg-gray-300 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
