import { useFormBuilder } from '@/common/form/form';
import { FieldType } from '@/common/form/types';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Icon } from './Icon';

export interface FieldListProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
  showSource: () => void;
}

export function FieldList(props: FieldListProps) {
  const { formBuilder } = props;

  const addTextInput = useCallback(() => {
    const id = uuidv4();
    formBuilder.addField({
      id,
      type: FieldType.TextInput,
      label: 'Text Input',
      name: `text-input-${id}`,
      required: false,
    });
  }, [formBuilder]);

  const addDateInput = useCallback(() => {
    const id = uuidv4();
    formBuilder.addField({
      id,
      type: FieldType.DateInput,
      label: 'Date Field',
      name: `date-input-${id}`,
      required: false,
    });
  }, [formBuilder]);

  const addTextArea = useCallback(() => {
    const id = uuidv4();
    formBuilder.addField({
      id,
      type: FieldType.TextArea,
      label: 'Text Area',
      name: `text-area-${id}`,
      required: false,
    });
  }, [formBuilder]);

  // Tentative field components
  const items = [
    // { label: "Autocomplete", icon: "autocomplete" },
    // { label: "Button", icon: "button" },
    // { label: "Checkbox Group", icon: "checkbox" },
    { label: 'Date Field', icon: 'date', onClick: addDateInput },
    // { label: "File Upload", icon: "upload" },
    // { label: "Header", icon: "header" },
    // { label: "Hidden Input", icon: "hidden" },
    // { label: "Number", icon: "number" },
    // { label: "Paragraph", icon: "paragraph" },
    // { label: "Radio Group", icon: "radio" },
    // { label: "Select", icon: "select" },
    { label: 'Text Field', icon: 'text', onClick: addTextInput },
    { label: 'Text Area', icon: 'textarea', onClick: addTextArea },
  ];

  return (
    <div className="w-64 bg-white/95 backdrop-blur rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
      <ul className="divide-y divide-gray-100">
        {items.map((it, i) => (
          <li key={i} className="group">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 text-left select-none transition
                             hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              onClick={it.onClick}
            >
              <span className="shrink-0 text-gray-600 group-hover:text-indigo-600">
                <Icon name={it.icon} />
              </span>
              <span className="text-sm text-gray-800 group-hover:text-gray-900">
                {it.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between p-2 bg-gray-50 border-t border-gray-100">
        <button
          onClick={formBuilder.clearForm}
          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Clear
        </button>
        <button
          onClick={props.showSource}
          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-800 text-white hover:bg-black transition"
        >
          {'[{…}]'}
        </button>
        <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">
          Share
        </button>
      </div>
    </div>
  );
}
