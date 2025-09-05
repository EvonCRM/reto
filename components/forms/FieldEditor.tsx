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
    <div className="mt-4 rounded-md border border-foreground/30 p-4 text-foreground shadow-sm">
      <h3 className="mb-2 font-semibold">
        {mode === 'create' ? 'Add field' : 'Edit field'}
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
            className="
              mt-1 block w-full rounded-md border border-foreground/30 bg-background px-3
              py-2 text-sm
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          >
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="textarea">Paragraph</option>
            <option value="select">Multiple Option</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nombre"
            className="
              mt-1 block w-full rounded-md border border-foreground/30 bg-background px-3
              py-2
              text-sm placeholder:text-muted-foreground
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Placeholder</label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Escribe aquí..."
            className="
              mt-1 block w-full rounded-md border border-foreground/30 bg-background px-3
              py-2
              text-sm placeholder:text-muted-foreground
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Help text</label>
          <input
            type="text"
            value={helpText}
            onChange={(e) => setHelpText(e.target.value)}
            placeholder="Descripción opcional"
            className="
              mt-1 block w-full rounded-md border border-foreground/30 bg-background px-3
              py-2
              text-sm placeholder:text-muted-foreground
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="required"
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="
              size-4 rounded
              border border-foreground/50 bg-transparent
              text-foreground
              accent-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[hsl(var(--active))]
            "
          />
          <label
            htmlFor="required"
            className="text-sm"
          >
            Required
          </label>
        </div>

        {type === 'select' && (
          <div className="mt-3 space-y-3 rounded-md border border-foreground/30 p-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={multiple}
                onChange={(e) => setMultiple(e.target.checked)}
                className="
                  size-4 rounded
                  border border-foreground/50 bg-transparent
                  accent-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[hsl(var(--active))]
                "
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
                    value={minSelected ?? ''}
                    onChange={(e) =>
                      setMinSelected(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="
                      mt-1 rounded-md border border-foreground/30 bg-background px-2
                      py-1 text-sm
                      hover:border-[hsl(var(--active))]
                      focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                    "
                  />
                </label>
                <label className="flex flex-col text-sm">
                  Máximo seleccionadas
                  <input
                    type="number"
                    min={0}
                    value={maxSelected ?? ''}
                    onChange={(e) =>
                      setMaxSelected(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="
                      mt-1 rounded-md border border-foreground/30 bg-background px-2
                      py-1 text-sm
                      hover:border-[hsl(var(--active))]
                      focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                    "
                  />
                </label>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allowCustom}
                onChange={(e) => setAllowCustom(e.target.checked)}
                className="
                  size-4 rounded
                  border border-foreground/50 bg-transparent
                  accent-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-[hsl(var(--active))]
                "
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
                    className="
                      col-span-2 rounded-md border border-foreground/30 bg-background px-2
                      py-1 text-sm
                      hover:border-[hsl(var(--active))]
                      focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                    "
                    placeholder="Etiqueta"
                    value={opt.label}
                    onChange={(e) =>
                      updateOption(idx, { label: e.target.value })
                    }
                  />
                  <input
                    className="
                      col-span-2 rounded-md border border-foreground/30 bg-background px-2
                      py-1 text-sm
                      hover:border-[hsl(var(--active))]
                      focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                    "
                    placeholder="Valor"
                    value={opt.value}
                    onChange={(e) =>
                      updateOption(idx, { value: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="
                      rounded-md border border-foreground/30 px-2
                      py-1 text-sm
                      hover:border-[hsl(var(--active))]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                    "
                  >
                    Delete
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addOption}
                className="
                  rounded-md border border-foreground/30 px-2
                  py-1 text-sm
                  hover:border-[hsl(var(--active))]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                "
              >
                Agregar opción
              </button>
            </div>
          </div>
        )}

        {/* Validaciones adicionales para text/textarea */}
        {(type === 'text' || type === 'textarea') && (
          <div className="grid grid-cols-2 gap-4">
            {/* 1) Selección de tipo de validación */}
            <div className="col-span-2">
              <label className="block text-sm font-medium">
                Field validation
              </label>
              <select
                value={validations.regex ?? ''}
                onChange={(e) =>
                  onValidationChange('regex', e.target.value || undefined)
                }
                className="
          mt-1 block w-full rounded-md
          border border-foreground/30 bg-background px-3 py-2 text-sm
          hover:border-[hsl(var(--active))]
          focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
        "
              >
                <option value="">Sin validación</option>
                <option value="phone">Teléfono (10 dígitos)</option>
                <option value="email">Correo electrónico</option>
                <option value="curp">CURP</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            {/* 2) Solo si es personalizado: regex + longitudes */}
            {validations.regex === 'custom' && (
              <>
                <div className="col-span-2">
                  <label className="block text-sm font-medium">
                    Regex personalizada
                  </label>
                  <input
                    type="text"
                    value={validations.customRegex ?? ''}
                    onChange={(e) =>
                      onValidationChange(
                        'customRegex',
                        e.target.value || undefined
                      )
                    }
                    placeholder="Ingrese patrón regex"
                    className="
              mt-1 block w-full rounded-md border border-foreground/30
              bg-background px-3 py-2 font-mono text-sm
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Longitud mínima
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={validations.minLength ?? ''}
                    onChange={(e) =>
                      onValidationChange(
                        'minLength',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="
              mt-1 block w-full rounded-md
              border border-foreground/30 bg-background px-3 py-2 text-sm
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Longitud máxima
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={validations.maxLength ?? ''}
                    onChange={(e) =>
                      onValidationChange(
                        'maxLength',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="
              mt-1 block w-full rounded-md
              border border-foreground/30 bg-background px-3 py-2 text-sm
              hover:border-[hsl(var(--active))]
              focus:border-[hsl(var(--active))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-md border border-foreground/30 px-4
              py-2 text-sm
              hover:border-[hsl(var(--active))]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="
              rounded-md border border-foreground/30 px-4
              py-2 text-sm
              hover:border-[hsl(var(--active))]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
            "
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;
