/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0
  const heightInMeters = height / 100
  return weight / (heightInMeters * heightInMeters)
}

/**
 * Calculate calorie deficit or surplus
 * @param {number} consumed - Calories consumed
 * @param {number} goal - Calorie goal
 * @returns {number} Difference in calories
 */
export const calculateCalorieDifference = (consumed, goal) => {
  return consumed - goal
}

/**
 * Calculate macro percentages
 * @param {number} protein - Protein in grams
 * @param {number} carbs - Carbs in grams
 * @param {number} fats - Fats in grams
 * @returns {object} Percentage breakdown
 */
export const calculateMacroPercentages = (protein, carbs, fats) => {
  const totalCals = protein * 4 + carbs * 4 + fats * 9
  if (totalCals === 0) return { protein: 0, carbs: 0, fats: 0 }

  return {
    protein: ((protein * 4) / totalCals * 100).toFixed(1),
    carbs: ((carbs * 4) / totalCals * 100).toFixed(1),
    fats: ((fats * 9) / totalCals * 100).toFixed(1)
  }
}

/**
 * Calculate progress percentage
 * @param {number} current - Current value
 * @param {number} goal - Goal value
 * @returns {number} Percentage (0-100+)
 */
export const calculateProgress = (current, goal) => {
  if (goal === 0) return 0
  return Math.min((current / goal) * 100, 100)
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (typeof date === 'string') return date
  return date.toISOString().split('T')[0]
}

/**
 * Calculate average from array of numbers
 * @param {number[]} values - Array of values
 * @returns {number} Average value
 */
export const calculateAverage = (values) => {
  if (values.length === 0) return 0
  return values.reduce((a, b) => a + b, 0) / values.length
}
