function Legend({ items }) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs text-gray-400">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-xs text-white font-medium">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default Legend
