import { FieldConfig } from '@/common/form/types';

export interface DateInputFieldProps {
  field: FieldConfig;
}

export function DateInputField(props: DateInputFieldProps) {
  return (
    <input
      type="date"
      id={props.field.name}
      name={props.field.name}
      required={props.field.required}
      // TODO: implement on change values
      // value={props.form.values[field.name]}
      // onChange={form.handleChange}
      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
    />
  );
}
