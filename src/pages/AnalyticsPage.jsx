import { useState } from 'react'

function AnalyticsPage() {
  const [analytics] = useState({
    average_calories: 1650,
    average_steps: 6800,
    total_exercises: 12,
    weight_trend: 'Stable',
    weekly_progress: 85
  })

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Analytics & Insights</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Daily Calories</h3>
          <p className="text-4xl font-bold text-blue-600">{analytics.average_calories}</p>
          <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Daily Steps</h3>
          <p className="text-4xl font-bold text-green-600">{analytics.average_steps}</p>
          <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Exercises</h3>
          <p className="text-4xl font-bold text-purple-600">{analytics.total_exercises}</p>
          <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Weight Trend</h3>
          <p className="text-4xl font-bold text-orange-600">{analytics.weight_trend}</p>
          <p className="text-sm text-gray-600 mt-2">Last 4 weeks</p>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Progress</h2>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-700">Overall Adherence</span>
            <span className="text-2xl font-bold text-green-600">{analytics.weekly_progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 bg-green-500 rounded-full"
              style={{ width: `${analytics.weekly_progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mt-8">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{day}</p>
              <div className="bg-blue-500 h-24 rounded-lg"></div>
              <p className="text-xs text-gray-600 mt-2">85%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Goals Summary</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Daily Calorie Goal</span>
              <span className="text-gray-600">1766 kcal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '93%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Daily Steps Goal</span>
              <span className="text-gray-600">7000 steps</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '97%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Weekly Exercise Goal</span>
              <span className="text-gray-600">3 sessions</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
