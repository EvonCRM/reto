export const VALIDATION_PATTERNS = {
  phone: {
    pattern: /^[0-9]{10}$/,
    message: 'Enter a valid phone number (10 digits)',
    example: '5512345678'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email',
    example: 'usuario@ejemplo.com'
  },
  curp: {
    pattern: /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/,
    message: 'Enter a valid CURP',
    example: 'ABCD123456HDFRRR09'
  }
} as const;

export type ValidationKey = keyof typeof VALIDATION_PATTERNS;

export function getPredefinedPattern(key: ValidationKey) {
  return VALIDATION_PATTERNS[key];
}

export function compileCustomRegex(input?: string): RegExp | null {
  if (!input) return null;

  try {
    const match = input.match(/^\/(.+)\/([a-z]*)$/i);
    if (match) {
      const [, body, flags] = match;
      return new RegExp(body, flags);
    }
    return new RegExp(input);
  } catch {
    return null;
  }
}
