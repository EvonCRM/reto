import { useMemo, useRef } from 'react';
import { useFormBuilder } from '@/common/form/form';
import { FieldConfig, FieldType } from '@/common/form/types';
import type { Identifier, XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';

import { DateInputField } from '../FormComponents/DateInputField';
import { TextAreaField } from '../FormComponents/TextAreaField';
import { TextInputField } from '../FormComponents/TextInputField';

export interface FormRendererProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
}

export interface RenderFieldProps {
  formBuilder: ReturnType<typeof useFormBuilder>;
  field: FieldConfig;
  index: number;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggableTypes = {
  FIELD: 'field'
};

export function RenderField(props: RenderFieldProps) {
  const Component = useMemo(() => {
    switch (props.field.type) {
      case FieldType.TextInput:
        return TextInputField;
      case FieldType.DateInput:
        return DateInputField;
      case FieldType.TextArea:
        return TextAreaField;
      default:
        return null;
    }
  }, [props.field.type]);

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: DraggableTypes.FIELD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.formBuilder.moveField(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: DraggableTypes.FIELD,
    item: () => {
      return { id: props.field.id, index: props.index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 30 : 100;
  drag(drop(ref));

  return (
    <div
      className={`flex flex-col mb-5 opacity-${opacity}`}
      ref={ref}
      data-handler-id={handlerId}
    >
      <label
        htmlFor={props.field.id}
        className="mb-3 block text-base font-medium text-[#07074D]"
      >
        {props.field.label}
      </label>
      {Component && <Component field={props.field} />}
    </div>
  );
}

export function FormRenderer(props: FormRendererProps) {
  const { formBuilder } = props;

  const currentStep = useMemo(() => {
    return formBuilder.form.steps[formBuilder.currentStep];
  }, [formBuilder]);

  return (
    <div className="bg-white p-8 shadow-lg rounded-lg h-full overflow-y-auto">
      <h1 className="text-2xl font-bold my-2">{currentStep.title}</h1>
      <p>{currentStep.description}</p>
      {currentStep.fields.map((field, index) => (
        <RenderField
          index={index}
          key={field.id}
          field={field}
          formBuilder={formBuilder}
        />
      ))}
    </div>
  );
}
