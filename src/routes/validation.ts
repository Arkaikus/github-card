import { themes } from '../themes.js';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateUsername(username: string | undefined): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  return { isValid: true };
}

export function validateDimensions(
  width: number,
  height: number
): ValidationResult {
  if (
    isNaN(width) ||
    isNaN(height) ||
    width < 200 ||
    width > 2000 ||
    height < 200 ||
    height > 2000
  ) {
    return {
      isValid: false,
      error: 'Width and height must be valid numbers between 200 and 2000',
    };
  }
  return { isValid: true };
}

export function parseQueryParams(query: {
  width?: string;
  height?: string;
  theme?: string;
}): {
  width: number;
  height: number;
  theme: keyof typeof themes;
} {
  const width = parseInt(query.width || '600');
  const height = parseInt(query.height || '400');
  const theme = (query.theme || 'default') as keyof typeof themes;

  return { width, height, theme };
}
