export interface FormConfig {
  title: string;
  description?: string;
  infoTop?: string;
  infoBottom?: string;
  type: 'simple' | 'multi-step';
  steps: FormStep[];
}

export enum FieldType {
  TextInput = 'TextInput',
  DateInput = 'DateInput',
  TextArea = 'TextArea',
}

export interface FormStep {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  id: string
  type: FieldType
  label: string
  name: string // auto-generated kebab-case
  placeholder?: string
  helpText?: string
  required: boolean
  validations?: {
    minLength?: number
    maxLength?: number
    regex?: 'phone' | 'email' | 'curp' | 'custom'
    customRegex?: string
  }
}

const VALIDATION_PATTERNS = {
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
}