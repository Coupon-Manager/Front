export default function SkeletonCouponRow() {
  return (
    <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between animate-pulse">
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-28 bg-gray-200 rounded" />
        <div className="h-2.5 w-16 bg-gray-200 rounded" />
      </div>
      <div className="h-5 w-10 bg-gray-200 rounded" />
    </div>
  )
}
