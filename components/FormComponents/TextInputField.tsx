import { FieldConfig } from '@/common/form/types';

export interface TextInputFieldProps {
  field: FieldConfig;
}

export function TextInputField(props: TextInputFieldProps) {
  return (
    <input
      id={props.field.id}
      name={props.field.name}
      type="text"
      placeholder={props.field.placeholder}
      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
    />
  )
}
