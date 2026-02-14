import themesData from '../templates/themes.json' assert { type: 'json' };

export interface Theme {
  bg: string;
  text: string;
  secondary: string;
  accent: string;
  border: string;
}

export const themes: Record<string, Theme> = themesData as Record<string, Theme>;
