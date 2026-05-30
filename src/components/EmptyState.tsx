interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-16 gap-3 px-8">
      <div className="text-gray-300">{icon}</div>
      <p className="text-gray-400 font-medium text-center">{title}</p>
      {subtitle && <p className="text-gray-300 text-sm text-center">{subtitle}</p>}
    </div>
  )
}
