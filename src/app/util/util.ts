export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Unexpected error';
}

export function getInitialLanguage(): string {
  // Check if running in a browser environment (avoids errors in SSR)
  if (typeof window === 'undefined') return 'en';

  // navigator.language returns codes like "en-US", "hu-HU"
  // .split('-')[0] turns "en-US" into "en"
  const browserLang = navigator.language.split('-')[0];

  // Optional: Define a list of your supported languages to prevent 404s
  const supportedLangs = ['en', 'hu'];

  return supportedLangs.includes(browserLang) ? browserLang : 'en';
}
