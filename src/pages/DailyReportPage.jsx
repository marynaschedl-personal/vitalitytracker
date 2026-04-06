import { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'

function DailyReportPage() {
  const [report, setReport] = useState({
    date: new Date().toISOString().split('T')[0],
    calories_consumed: 0,
    calories_goal: 1766,
    protein_consumed: 0,
    steps: 0,
    steps_goal: 7000,
    exercises_done: 0,
    exercises_goal: 3,
    meals: [],
    notes: ''
  })

  const [mealInput, setMealInput] = useState({
    name: '',
    calories: 0,
    protein: 0,
    consumed_grams: 0,
    target_grams: 0,
    category: ''
  })

  const handleMealAdd = () => {
    if (mealInput.name.trim()) {
      setReport(prev => ({
        ...prev,
        meals: [...prev.meals, { ...mealInput }],
        calories_consumed: prev.calories_consumed + mealInput.calories,
        protein_consumed: prev.protein_consumed + mealInput.protein
      }))
      setMealInput({
        name: '',
        calories: 0,
        protein: 0,
        consumed_grams: 0,
        target_grams: 0,
        category: ''
      })
    }
  }

  const handleMealRemove = (index) => {
    const meal = report.meals[index]
    setReport(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index),
      calories_consumed: prev.calories_consumed - meal.calories,
      protein_consumed: prev.protein_consumed - meal.protein
    }))
  }

  const handleInputChange = (field, value) => {
    setReport(prev => ({
      ...prev,
      [field]: typeof value === 'string' && !['date', 'notes'].includes(field) ? parseFloat(value) || 0 : value
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log('Saving report:', report)
    alert('Daily report saved!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Daily Report</h1>

      {/* Date */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <input
          type="date"
          value={report.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Progress Bars */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Progress</h2>

        <ProgressBar
          current={report.calories_consumed}
          goal={report.calories_goal}
          label="Calories"
          unit="kcal"
        />

        <ProgressBar
          current={report.protein_consumed}
          goal={100}
          label="Protein"
          unit="g"
        />

        <ProgressBar
          current={report.steps}
          goal={report.steps_goal}
          label="Steps"
        />

        <ProgressBar
          current={report.exercises_done}
          goal={report.exercises_goal}
          label="Exercises"
        />
      </div>

      {/* Input Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Metrics</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calories Goal</label>
            <input
              type="number"
              value={report.calories_goal}
              onChange={(e) => handleInputChange('calories_goal', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steps Goal</label>
            <input
              type="number"
              value={report.steps_goal}
              onChange={(e) => handleInputChange('steps_goal', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steps Taken</label>
            <input
              type="number"
              value={report.steps}
              onChange={(e) => handleInputChange('steps', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exercises Done</label>
            <input
              type="number"
              value={report.exercises_done}
              onChange={(e) => handleInputChange('exercises_done', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Meals</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Meal name"
            value={mealInput.name}
            onChange={(e) => setMealInput(prev => ({ ...prev, name: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Calories"
            value={mealInput.calories}
            onChange={(e) => setMealInput(prev => ({ ...prev, calories: parseFloat(e.target.value) || 0 }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Protein (g)"
            value={mealInput.protein}
            onChange={(e) => setMealInput(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Category"
            value={mealInput.category}
            onChange={(e) => setMealInput(prev => ({ ...prev, category: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleMealAdd}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold mb-4"
        >
          Add Meal
        </button>

        {report.meals.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Added Meals</h3>
            {report.meals.map((meal, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-2">
                <div>
                  <p className="font-medium text-gray-800">{meal.name}</p>
                  <p className="text-sm text-gray-600">{meal.calories} kcal | {meal.protein}g protein | {meal.category}</p>
                </div>
                <button
                  onClick={() => handleMealRemove(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Daily Notes</label>
        <textarea
          value={report.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any notes about your day..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold text-lg"
      >
        Save Daily Report
      </button>
    </div>
  )
}

export default DailyReportPage
