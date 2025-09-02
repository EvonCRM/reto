import { FieldConfig } from '@/common/form/types';
import React, { useRef, useEffect } from 'react';

export interface TextAreaFieldProps {
  field: FieldConfig;
}

export function TextAreaField(props: TextAreaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <textarea
      ref={textareaRef}
      id={props.field.id}
      name={props.field.name}
      placeholder={props.field.placeholder}
      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md resize-none"
      onInput={handleInput}
    />
  );
}
