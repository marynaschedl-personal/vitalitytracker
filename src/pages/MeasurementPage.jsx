import { useState } from 'react'

function MeasurementPage() {
  const [measurements, setMeasurements] = useState([])
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    body_fat_percentage: 0,
    muscle_mass: 0,
    chest: 0,
    waist: 0,
    hips: 0,
    thigh: 0,
    bicep: 0,
    notes: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' && field !== 'date' && field !== 'notes' ? parseFloat(value) || 0 : value
    }))
  }

  const handleAddMeasurement = () => {
    if (formData.date) {
      setMeasurements(prev => [
        { ...formData, id: Date.now().toString() },
        ...prev
      ])
      setFormData({
        date: new Date().toISOString().split('T')[0],
        weight: 0,
        body_fat_percentage: 0,
        muscle_mass: 0,
        chest: 0,
        waist: 0,
        hips: 0,
        thigh: 0,
        bicep: 0,
        notes: ''
      })
    }
  }

  const handleRemove = (id) => {
    setMeasurements(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Measurements</h1>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Measurement</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat (%)</label>
            <input
              type="number"
              value={formData.body_fat_percentage}
              onChange={(e) => handleInputChange('body_fat_percentage', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Muscle Mass (kg)</label>
            <input
              type="number"
              value={formData.muscle_mass}
              onChange={(e) => handleInputChange('muscle_mass', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chest (cm)</label>
            <input
              type="number"
              value={formData.chest}
              onChange={(e) => handleInputChange('chest', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Waist (cm)</label>
            <input
              type="number"
              value={formData.waist}
              onChange={(e) => handleInputChange('waist', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hips (cm)</label>
            <input
              type="number"
              value={formData.hips}
              onChange={(e) => handleInputChange('hips', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thigh (cm)</label>
            <input
              type="number"
              value={formData.thigh}
              onChange={(e) => handleInputChange('thigh', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bicep (cm)</label>
            <input
              type="number"
              value={formData.bicep}
              onChange={(e) => handleInputChange('bicep', e.target.value)}
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Add any notes..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <button
          onClick={handleAddMeasurement}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold"
        >
          Add Measurement
        </button>
      </div>

      {/* Measurements List */}
      {measurements.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Previous Measurements</h2>

          {measurements.map((measurement) => (
            <div key={measurement.id} className="border-b pb-6 mb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{measurement.date}</h3>
                <button
                  onClick={() => handleRemove(measurement.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {measurement.weight > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Weight:</span>
                    <p className="font-semibold text-gray-800">{measurement.weight} kg</p>
                  </div>
                )}
                {measurement.body_fat_percentage > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Body Fat:</span>
                    <p className="font-semibold text-gray-800">{measurement.body_fat_percentage}%</p>
                  </div>
                )}
                {measurement.muscle_mass > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Muscle Mass:</span>
                    <p className="font-semibold text-gray-800">{measurement.muscle_mass} kg</p>
                  </div>
                )}
                {measurement.chest > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Chest:</span>
                    <p className="font-semibold text-gray-800">{measurement.chest} cm</p>
                  </div>
                )}
                {measurement.waist > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Waist:</span>
                    <p className="font-semibold text-gray-800">{measurement.waist} cm</p>
                  </div>
                )}
                {measurement.hips > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Hips:</span>
                    <p className="font-semibold text-gray-800">{measurement.hips} cm</p>
                  </div>
                )}
                {measurement.thigh > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Thigh:</span>
                    <p className="font-semibold text-gray-800">{measurement.thigh} cm</p>
                  </div>
                )}
                {measurement.bicep > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Bicep:</span>
                    <p className="font-semibold text-gray-800">{measurement.bicep} cm</p>
                  </div>
                )}
              </div>

              {measurement.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600"><strong>Notes:</strong> {measurement.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MeasurementPage
