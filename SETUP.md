# VitalityTracker - Setup & Run Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Copy the example env file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Base44 credentials:
```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
VITE_BASE44_FUNCTIONS_VERSION=latest
```

### 3. Run Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173`

### 4. Demo Login
**Demo Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

Click Login to access the app.

## Features

### ✅ Home Page
- Daily nutrition, steps, exercises tracking
- Body measurement trends
- Progress rings and mini charts

### ✅ Nutrition (Racion)
- Food category tracking (A-N categories)
- Slider-based portion control
- Calorie and protein calculations
- Meal history

### ✅ Workouts
- Exercise logging
- Weekly workout tracking
- Goal progress visualization

### ✅ Steps
- Daily step counter
- Weekly bar chart
- Step goal reference line
- Average calculation

### ✅ Measurements
- Body measurements by type (weight, chest, waist, etc.)
- Trend analysis with line charts
- Historical data with seed examples
- Edit and add new measurements

### ✅ Responsive Mobile UI
- Bottom navigation
- Tailwind CSS theming
- Dark mode support
- Touch-friendly controls

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript/JavaScript** - Programming language
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide Icons** - Icons
- **React Query** - State management
- **Moment.js** - Date handling
- **Base44 SDK** - Backend integration

## Available Routes

- `/` - Home dashboard
- `/login` - Login page
- `/racion` - Nutrition tracking
- `/exercises` - Workout tracking
- `/steps` - Step counter
- `/measurements` - Measurement selection
- `/measurements/:type` - Detailed measurement view

## Components

### UI Components
- `BottomNav` - Mobile navigation
- `DashboardCard` - Reusable card component
- `ProgressRing` - Circular progress indicator
- `MiniChart` - Compact line chart
- `Button`, `Input`, `Dialog`, `Slider` - Form elements
- `Layout` - Main layout wrapper

### Pages
- `Home` - Dashboard with daily stats
- `Login` - Authentication page
- `Racion` - Nutrition/meal tracking
- `Exercises` - Workout management
- `Steps` - Step tracking
- `Measurements` - Measurement selection
- `MeasurementDetail` - Individual measurement tracking

## Troubleshooting

### Port Already in Use
If port 5173 is taken:
```bash
npm run dev -- --port 3000
```

### Missing Dependencies
If you get dependency errors:
```bash
npm install
npm run dev
```

### Clear Cache
If styles or assets aren't updating:
```bash
rm -rf node_modules .vite
npm install
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run typecheck` - TypeScript checking
- `npm run preview` - Preview production build

## Support

For issues or questions, check:
1. Browser console for errors (F12)
2. Network tab for API calls
3. Component props and state in React DevTools

Enjoy tracking your health! 💪
