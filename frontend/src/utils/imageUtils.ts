// Default images for different exercise categories
const defaultExerciseImages: Record<string, string> = {
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  zen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  calisthenics: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  powerlifting: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  cardio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  strength: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  flexibility: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
};

// Default images for different meal categories
const defaultMealImages: Record<string, string> = {
  satvik: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  ayurvedic: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  regular: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  breakfast: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  dinner: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  snack: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400',
};

// Default images for different healing activity categories
const defaultHealingImages: Record<string, string> = {
  meditation: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  breathing: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  ayurvedic: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  wellness: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  therapy: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
};

/**
 * Get the appropriate image URL for an exercise
 * @param exercise - The exercise object
 * @returns The image URL (either the provided one or a default based on category)
 */
export const getExerciseImageUrl = (exercise: { imageUrl?: string; category: string }): string => {
  if (exercise.imageUrl) {
    return exercise.imageUrl;
  }
  return defaultExerciseImages[exercise.category] || defaultExerciseImages.yoga;
};

/**
 * Get the appropriate image URL for a meal
 * @param meal - The meal object
 * @returns The image URL (either the provided one or a default based on category)
 */
export const getMealImageUrl = (meal: { imageUrl?: string; category: string }): string => {
  if (meal.imageUrl) {
    return meal.imageUrl;
  }
  return defaultMealImages[meal.category] || defaultMealImages.regular;
};

/**
 * Get the appropriate image URL for a healing activity
 * @param activity - The healing activity object
 * @returns The image URL (either the provided one or a default based on category)
 */
export const getHealingImageUrl = (activity: { imageUrl?: string; category: string }): string => {
  if (activity.imageUrl) {
    return activity.imageUrl;
  }
  return defaultHealingImages[activity.category] || defaultHealingImages.meditation;
};

/**
 * Check if an image URL is valid and accessible
 * @param url - The image URL to check
 * @returns Promise<boolean> - True if the image is accessible
 */
export const isImageAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}; 