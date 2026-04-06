// Local storage utilities

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error)
      return null
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error)
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error)
    }
  },

  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing storage', error)
    }
  }
}

export default storage
