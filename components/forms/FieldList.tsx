import React from 'react';

import { FieldConfig } from '@/types/form';

interface FieldListProps {
  fields: FieldConfig[];
  onEdit: (field: FieldConfig) => void;
  onDelete: (fieldId: string) => void;
}

const FieldList: React.FC<FieldListProps> = ({ fields, onEdit, onDelete }) => {
  return (
    <div className="mt-4 space-y-2">
      {fields.length === 0 ? (
        <p className="text-sm text-gray-500">No hay campos en este paso.</p>
      ) : (
        <ul className="space-y-2">
          {fields.map((field) => (
            <li
              key={field.id}
              className="flex items-center justify-between rounded border bg-gray-50 p-2 hover:bg-gray-100"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{field.label}</span>
                <span className="text-xs text-gray-500">
                  Tipo: {field.type} {field.required ? '· Requerido' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border border-indigo-600 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
                  onClick={() => onEdit(field)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="rounded border border-red-600 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => onDelete(field.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FieldList;
