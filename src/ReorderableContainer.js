import React, { useEffect, useRef, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';

const removeAtIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const insertAtIndex = (array, index, item) => {
  return [...array.slice(0, index), item, ...array.slice(index)];
};

const ReorderableContainer = ({ children, items: defaultItems, onReorder }) => {
  const [items, setItems] = useState(defaultItems);
  const notInitialRender = useRef(false)

  useEffect(() => setItems(items), [defaultItems, setItems]);

  useEffect(() => {
    if (notInitialRender.current && onReorder) onReorder(items);
    else notInitialRender.current = true
  }, [items]);

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};

export default ReorderableContainer;
