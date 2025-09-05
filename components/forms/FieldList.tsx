import React from 'react';

import { FieldConfig } from '@/types/form';

interface FieldListProps {
  fields: FieldConfig[];
  onEdit: (field: FieldConfig) => void;
  onDelete: (fieldId: string) => void;
}

const FieldList: React.FC<FieldListProps> = ({ fields, onEdit, onDelete }) => {
  return (
    <div className="mt-4 space-y-2 text-foreground">
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          There are no fields for this step.
        </p>
      ) : (
        <ul className="space-y-2">
          {fields.map((field) => (
            <li
              key={field.id}
              className="
                flex items-center justify-between rounded-md
                border border-foreground/30 p-2
                transition-colors hover:border-[hsl(var(--active))]
              "
            >
              <div className="flex flex-col">
                <span className="font-medium">{field.label}</span>
                <span className="text-xs text-muted-foreground">
                  Type: {field.type} {field.required ? '· Required' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(field)}
                  className="
                    inline-flex items-center gap-1 rounded-md border border-foreground/30 px-2
                    py-1 text-xs text-foreground
                    hover:border-[hsl(var(--active))]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                  "
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(field.id)}
                  className="
                    inline-flex items-center gap-1 rounded-md border border-foreground/30 px-2
                    py-1 text-xs text-foreground
                    hover:border-[hsl(var(--active))]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--active))]
                  "
                >
                  Delete
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
