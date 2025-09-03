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
  onSave: (
    data: Partial<FieldConfig> & {
      type: FieldType;
      label: string;
      required: boolean;
    }
  ) => void;
  /** Cancelar edición / creación */
  onCancel: () => void;
  /** Indica si se trata de un nuevo campo o de una edición */
  mode: 'create' | 'edit';
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  initial = {},
  onSave,
  onCancel,
  mode
}) => {
  const [type, setType] = useState<FieldType>(initial.type ?? 'text');
  const [label, setLabel] = useState(initial.label ?? '');
  const [placeholder, setPlaceholder] = useState(initial.placeholder ?? '');
  const [helpText, setHelpText] = useState(initial.helpText ?? '');
  const [required, setRequired] = useState(initial.required ?? false);
  const [options, setOptions] = useState<SelectOption[]>(
    initial?.type === 'select'
      ? ((initial as any).options ?? [{ label: '', value: '' }])
      : [{ label: '', value: '' }]
  );

  const [multiple, setMultiple] = useState<boolean>(
    initial?.type === 'select' ? Boolean((initial as any).multiple) : false
  );

  const [minSelected, setMinSelected] = useState<number | undefined>(
    initial?.type === 'select' ? (initial as any).minSelected : undefined
  );

  const [maxSelected, setMaxSelected] = useState<number | undefined>(
    initial?.type === 'select' ? (initial as any).maxSelected : undefined
  );

  const [allowCustom, setAllowCustom] = useState<boolean>(
    initial?.type === 'select' ? Boolean((initial as any).allowCustom) : false
  );
  const [validations, setValidations] = useState<FieldValidation>(
    initial.validations ?? {}
  );

  const addOption = () =>
    setOptions((prev) => [...prev, { label: '', value: '' }]);

  const updateOption = (idx: number, patch: Partial<SelectOption>) =>
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, ...patch } : o))
    );

  const removeOption = (idx: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    // Construir objeto con los valores actuales
    const data: Partial<FieldConfig> & {
      type: FieldType;
      label: string;
      required: boolean;
    } = {
      type,
      label,
      placeholder,
      helpText,
      required,
      validations
    };
    if (type === 'select') {
      // limpiar y validar opciones
      const clean = options
        .map((o) => ({ label: o.label.trim(), value: o.value.trim() }))
        .filter((o) => o.label && o.value);

      // no permitir duplicados por value
      const values = new Set<string>();
      const hasDup = clean.some((o) => {
        if (values.has(o.value)) return true;
        values.add(o.value);
        return false;
      });
      if (clean.length === 0) {
        // muestra toast o inline error
        return;
      }
      if (hasDup) {
        // muestra toast o inline error
        return;
      }
      if (
        multiple &&
        typeof minSelected === 'number' &&
        typeof maxSelected === 'number' &&
        minSelected > maxSelected
      ) {
        // muestra error: min no puede ser > max
        return;
      }

      // armar payload con props del select
      onSave({
        type: 'select',
        label,
        placeholder,
        helpText,
        required,
        options: clean,
        multiple: Boolean(multiple),
        minSelected: multiple ? minSelected : undefined,
        maxSelected: multiple ? maxSelected : undefined,
        allowCustom: Boolean(allowCustom)
        // NO mandes id ni name aquí; tu capa de addField/updateField se encarga
      });
    } else {
      // tu onSave original para text/date/textarea
      onSave({
        type,
        label,
        placeholder,
        helpText,
        required,
        validations // si usas
      });
    }
  };

  const onValidationChange = (field: keyof FieldValidation, value: any) => {
    setValidations((prev) => ({ ...prev, [field]: value || undefined }));
  };

  return (
    <div className="mt-4 rounded border bg-white p-4 shadow-md">
      <h3 className="mb-2 font-semibold text-gray-800">
        {mode === 'create' ? 'Agregar campo' : 'Editar campo'}
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>
          <select
            className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            <option value="text">Texto</option>
            <option value="date">Fecha</option>
            <option value="textarea">Área de texto</option>
            <option value="select">Select</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Etiqueta
          </label>
          <input
            className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Placeholder
          </label>
          <input
            className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Escribe aquí..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Texto de ayuda
          </label>
          <input
            className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            type="text"
            value={helpText}
            onChange={(e) => setHelpText(e.target.value)}
            placeholder="Descripción opcional"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="required"
            type="checkbox"
            className="size-4 rounded border-gray-300 text-indigo-600"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          <label
            htmlFor="required"
            className="text-sm text-gray-700"
          >
            Requerido
          </label>
        </div>
        {type === 'select' && (
          <div className="mt-3 space-y-3 rounded border p-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={multiple}
                onChange={(e) => setMultiple(e.target.checked)}
              />
              <span>Selección múltiple</span>
            </label>

            {multiple && (
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col text-sm">
                  Mínimo seleccionadas
                  <input
                    type="number"
                    min={0}
                    className="mt-1 rounded border px-2 py-1"
                    value={minSelected ?? ''}
                    onChange={(e) =>
                      setMinSelected(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Máximo seleccionadas
                  <input
                    type="number"
                    min={0}
                    className="mt-1 rounded border px-2 py-1"
                    value={maxSelected ?? ''}
                    onChange={(e) =>
                      setMaxSelected(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </label>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allowCustom}
                onChange={(e) => setAllowCustom(e.target.checked)}
              />
              <span>Permitir valores fuera de las opciones</span>
            </label>

            <div className="space-y-2">
              <div className="text-sm font-medium">Opciones</div>
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 gap-2"
                >
                  <input
                    className="col-span-2 rounded border px-2 py-1 text-sm"
                    placeholder="Etiqueta"
                    value={opt.label}
                    onChange={(e) =>
                      updateOption(idx, { label: e.target.value })
                    }
                  />
                  <input
                    className="col-span-2 rounded border px-2 py-1 text-sm"
                    placeholder="Valor"
                    value={opt.value}
                    onChange={(e) =>
                      updateOption(idx, { value: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                    onClick={() => removeOption(idx)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="rounded border px-2 py-1 text-sm hover:bg-gray-50"
                onClick={addOption}
              >
                Agregar opción
              </button>
            </div>
          </div>
        )}

        {/* Validaciones adicionales para campos de texto */}
        {type === 'text' || type === 'textarea' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitud mínima
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={validations.minLength ?? ''}
                onChange={(e) =>
                  onValidationChange(
                    'minLength',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitud máxima
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={validations.maxLength ?? ''}
                onChange={(e) =>
                  onValidationChange(
                    'maxLength',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Validación regex
              </label>
              <select
                className="mt-1 block w-full rounded border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={validations.regex ?? ''}
                onChange={(e) =>
                  onValidationChange('regex', e.target.value || undefined)
                }
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
                <label className="block text-sm font-medium text-gray-700">
                  Regex personalizada
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded border-gray-300 font-mono text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={validations.customRegex ?? ''}
                  onChange={(e) =>
                    onValidationChange(
                      'customRegex',
                      e.target.value || undefined
                    )
                  }
                  placeholder="Ingrese patrón regex"
                />
              </div>
            )}
          </div>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
