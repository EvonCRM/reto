export type FieldType = 'text' | 'date' | 'textarea' | 'select';

export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Configuración de las validaciones para un campo.
 * Permite longitud mínima/máxima y patrones regex predefinidos o personalizados.
 */
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  regex?: 'phone' | 'email' | 'curp' | 'custom';
  customRegex?: string;
}

/**
 * Configuración de un campo individual dentro del formulario.
 *
 */

export type FieldConfig =
  | (FieldConfigBase & { type: 'text' | 'date' | 'textarea' })
  | FieldSelectConfig;

export interface FieldSelectConfig extends Omit<FieldConfigBase, 'type'> {
  type: 'select';
  options: SelectOption[]; // opciones disponibles
  multiple?: boolean; // true = selección múltiple
  minSelected?: number; // opcional, solo si multiple
  maxSelected?: number; // opcional, solo si multiple
  allowCustom?: boolean; // opcional: permitir valores fuera de options
}

export interface FieldConfigBase {
  id: string;
  type: FieldType;
  label: string;
  name: string; // generado automáticamente en kebab-case
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validations?: FieldValidation;
}

/**
 * Un paso de un formulario multi‑step. Para formularios simples basta con un único paso.
 */
export interface FormStep {
  id: string;
  title?: string;
  fields: FieldConfig[];
}

/**
 * Configuración general del formulario.
 */
export interface FormConfig {
  title: string;
  description?: string;
  infoTop?: string;
  infoBottom?: string;
  type: 'simple' | 'multi-step';
  steps: FormStep[];

  // NUEVO: imagen de fondo del formulario (opcional)
  backgroundUrl?: string; // URL absoluta o relativa
  backgroundMode?: 'cover' | 'contain'; // opcional, por defecto 'cover'
  backgroundTint?: 'none' | 'dark' | 'light'; // opcional, para legibilidad
}

export type ThemeId = 'light' | 'ocean' | 'sunset' | 'terminal';

export interface FormMeta {
  id: string;
  title: string;
  description?: string;
  type: 'simple' | 'multi-step';
  theme: ThemeId;
  coverUrl?: string; // imagen de fondo/portada
  updatedAt: string; // ISO
  fieldsCount: number; // denormalizado para pintar rápido
  stepsCount: number; // denormalizado
}

export interface StoredForm {
  meta: FormMeta;
  config: FormConfig; // el FormConfig completo que ya manejas
}
