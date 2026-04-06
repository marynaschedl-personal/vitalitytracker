/**
 * Utility function to combine classNames
 * Used for conditional styling with Tailwind CSS
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
