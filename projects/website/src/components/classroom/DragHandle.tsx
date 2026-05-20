import React from 'react';

interface DragHandleProps {
  listeners?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
}

/**
 * Drag handle icon for sortable items.
 * Pass dnd-kit listener/attribute props from useSortable().
 */
const DragHandle: React.FC<DragHandleProps> = ({ listeners, attributes }) => {
  return (
    <button
      className="classroom-drag-handle"
      type="button"
      aria-label="Drag to reorder"
      {...listeners}
      {...attributes}
    >
      <i className="fa-solid fa-grip-vertical"></i>
    </button>
  );
};

export default DragHandle;
