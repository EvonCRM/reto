import React, { useState } from 'react';
import type { FieldConfig, FieldType, FieldValidation } from '../types/form';

interface FieldEditorProps {
  /** Datos iniciales para el campo cuando se edita. */
  initial?: Partial<FieldConfig>;
  /**
   * Callback que se ejecuta al guardar. Para nuevos campos devolverá
   * todas las propiedades excepto `id` y `name`; para actualizaciones
   * devolverá solo las propiedades modificadas.
   */
  onSave: (data: Partial<FieldConfig> & { type: FieldType; label: string; required: boolean }) => void;
  /** Cancelar edición / creación */
  onCancel: () => void;
  /** Indica si se trata de un nuevo campo o de una edición */
  mode: 'create' | 'edit';
}

const FieldEditor: React.FC<FieldEditorProps> = ({ initial = {}, onSave, onCancel, mode }) => {
  const [type, setType] = useState<FieldType>(initial.type ?? 'text');
  const [label, setLabel] = useState(initial.label ?? '');
  const [placeholder, setPlaceholder] = useState(initial.placeholder ?? '');
  const [helpText, setHelpText] = useState(initial.helpText ?? '');
  const [required, setRequired] = useState(initial.required ?? false);
  const [validations, setValidations] = useState<FieldValidation>(initial.validations ?? {});

  const handleSave = () => {
    // Construir objeto con los valores actuales
    const data: Partial<FieldConfig> & { type: FieldType; label: string; required: boolean } = {
      type,
      label,
      placeholder,
      helpText,
      required,
      validations,
    };
    onSave(data);
  };

  const onValidationChange = (field: keyof FieldValidation, value: any) => {
    setValidations(prev => ({ ...prev, [field]: value || undefined }));
  };

  return (
    <div className="p-4 border rounded bg-white shadow-md mt-4">
      <h3 className="font-semibold mb-2 text-gray-800">
        {mode === 'create' ? 'Agregar campo' : 'Editar campo'}
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            value={type}
            onChange={e => setType(e.target.value as FieldType)}
          >
            <option value="text">Texto</option>
            <option value="date">Fecha</option>
            <option value="textarea">Área de texto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Etiqueta</label>
          <input
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Placeholder</label>
          <input
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            type="text"
            value={placeholder}
            onChange={e => setPlaceholder(e.target.value)}
            placeholder="Escribe aquí..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Texto de ayuda</label>
          <input
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            type="text"
            value={helpText}
            onChange={e => setHelpText(e.target.value)}
            placeholder="Descripción opcional"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="required"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            checked={required}
            onChange={e => setRequired(e.target.checked)}
          />
          <label htmlFor="required" className="text-sm text-gray-700">
            Requerido
          </label>
        </div>

        {/* Validaciones adicionales para campos de texto */}
        {type === 'text' || type === 'textarea' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitud mínima</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={validations.minLength ?? ''}
                onChange={e => onValidationChange('minLength', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitud máxima</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={validations.maxLength ?? ''}
                onChange={e => onValidationChange('maxLength', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Validación regex</label>
              <select
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                value={validations.regex ?? ''}
                onChange={e => onValidationChange('regex', e.target.value || undefined)}
              >
                <option value="">Sin validación</option>
                <option value="phone">Teléfono (10 dígitos)</option>
                <option value="email">Correo electrónico</option>
                <option value="curp">CURP</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
            {validations.regex === 'custom' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Regex personalizada</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono"
                  value={validations.customRegex ?? ''}
                  onChange={e => onValidationChange('customRegex', e.target.value || undefined)}
                  placeholder="Ingrese patrón regex"
                />
              </div>
            )}
          </div>
        ) : null}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white bg-indigo-600 border border-indigo-600 rounded hover:bg-indigo-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;