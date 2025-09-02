import { useFormBuilder } from '@/common/form/form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface SourceCodeProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
  onClose: () => void;
}

function useDebounce(f: (...args: any[]) => void, delay: number) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        f(...args);
      }, delay);
    },
    [f, delay]
  );

  return debouncedFunction;
}

export function SourceCode(props: SourceCodeProps) {
  const [copied, setCopied] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const sourceCode = useMemo(() => {
    return JSON.stringify(props.formBuilder.form, null, 2);
  }, [props.formBuilder.form]);
  
  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(sourceCode);
    }
  }, [sourceCode, isEditing]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sourceCode]);

  const debouncedSetForm = useDebounce((newForm: string) => {
    props.formBuilder.trySetForm(newForm);
    setIsEditing(false);
  }, 500);

  const onSourceCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setCurrentValue(text);
      setIsEditing(true);
      debouncedSetForm(text);
    },
    [debouncedSetForm]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/80"
      onClick={props.onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[80vh] flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-4 right-4 flex gap-2 bg-white/70 p-1 rounded-lg">
          <button
            className="text-gray-500 py-1 rounded text-sm hover:text-gray-800"
            onClick={handleCopy}
            aria-label="Copiar código"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <rect
                x="9"
                y="2"
                width="6"
                height="4"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
                fill="white"
              />
              <rect
                x="5"
                y="6"
                width="14"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </button>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            onClick={props.onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-auto flex-1">
          <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto">
            <textarea
              className="w-full h-96 bg-gray-100 rounded p-4 text-sm font-mono resize-none outline-none"
              value={currentValue}
              onChange={onSourceCodeChange}
              spellCheck={false}
            ></textarea>
          </pre>
        </div>
        {copied && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-500 px-4 py-2 rounded shadow">
            ¡Copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
}
