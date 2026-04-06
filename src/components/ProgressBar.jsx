function ProgressBar({ current, goal, label, unit = '' }) {
  const percentage = Math.min((current / goal) * 100, 100)
  const isComplete = current >= goal

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-gray-700">{label}</span>
        <span className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
          {current.toFixed(1)} / {goal} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all ${
            isComplete ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
