import { BULLET_POINTS } from "./bullet-points";

/**
 * Cleans text by removing unwanted special characters while preserving
 * common resume formatting characters like bullet points.
 * 
 * @param text The text to clean
 * @returns Cleaned text with only allowed special characters
 */
export const cleanText = (text: string): string => {
  if (!text) return "";
  
  // Create a regex pattern that excludes the bullet points we want to keep
  const bulletPointsEscaped = BULLET_POINTS.map(bp => bp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
  
  // Allow these characters: alphanumeric, space, bullet points, and basic punctuation
  const allowedCharsRegex = new RegExp(`[^a-zA-Z0-9\\s${bulletPointsEscaped}.,;:()\\-/%+&'"]`, 'g');
  
  // Replace unwanted special characters with empty string
  return text.replace(allowedCharsRegex, '');
};

/**
 * Cleans an array of strings by removing unwanted special characters
 * 
 * @param textArray Array of strings to clean
 * @returns Array of cleaned strings
 */
export const cleanTextArray = (textArray: string[]): string[] => {
  if (!textArray || !Array.isArray(textArray)) return [];
  
  return textArray.map(text => cleanText(text));
};
