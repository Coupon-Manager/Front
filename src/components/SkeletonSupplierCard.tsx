export default function SkeletonSupplierCard() {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-gray-200" />
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-5 w-10 bg-gray-200 rounded" />
    </div>
  )
}
