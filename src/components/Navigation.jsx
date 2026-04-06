import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            VitalityTracker
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Daily Report
              </Link>
            </li>
            <li>
              <Link to="/measurements" className="text-gray-700 hover:text-blue-600 font-medium">
                Measurements
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">
                Analytics
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
