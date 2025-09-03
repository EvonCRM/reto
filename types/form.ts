export type FieldType = 'text' | 'date' | 'textarea';

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  regex?: 'phone' | 'email' | 'curp' | 'custom';
  customRegex?: string;
}

export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validations?: FieldValidation;
}

export interface FormStep {
  id: string;
  title?: string;
  fields: FieldConfig[];
}

export interface FormConfig {
  title: string;
  description?: string;
  infoTop?: string;
  infoBottom?: string;
  type: 'simple' | 'multi-step';
  steps: FormStep[];
}
