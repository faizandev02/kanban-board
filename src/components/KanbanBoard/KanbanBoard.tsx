import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { CardType, ColumnType } from "./types";
import { initialData } from "./dummyData";
import Column from "./Column";
import Card from "./Card";
import "./styles.css";

const KANBAN_BOARD_LS_KEY = "kanban-board-data";

export default function KanbanBoard() {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const savedData = localStorage.getItem(KANBAN_BOARD_LS_KEY);
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(KANBAN_BOARD_LS_KEY, JSON.stringify(columns));
  }, [columns]);


  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id.toString();
    const card = columns
      .flatMap((col) => col.cards)
      .find((c) => c.id === activeId);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    setColumns((prev) => {
      const activeCol = prev.find((col) =>
        col.cards.some((card) => card.id === activeId),
      );
      const overCol = prev.find(
        (col) =>
          col.id === overId || col.cards.some((card) => card.id === overId),
      );

      if (!activeCol || !overCol || activeCol.id === overCol.id) return prev;

      const activeIndex = activeCol.cards.findIndex((c) => c.id === activeId);
      const overIndex = overCol.cards.findIndex((c) => c.id === overId);

      const newColumns = structuredClone(prev) as ColumnType[];
      const sourceCol = newColumns.find((c) => c.id === activeCol.id)!;
      const destCol = newColumns.find((c) => c.id === overCol.id)!;

      const [movedCard] = sourceCol.cards.splice(activeIndex, 1);

      if (overCol.id === overId) {
        destCol.cards.push(movedCard);
      } else {
        destCol.cards.splice(overIndex, 0, movedCard);
      }

      return newColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    setColumns((prev) => {
      const activeCol = prev.find((col) =>
        col.cards.some((card) => card.id === activeId),
      );
      const overCol = prev.find((col) =>
        col.cards.some((card) => card.id === overId),
      );

      if (!activeCol || !overCol || activeCol.id !== overCol.id) return prev;

      const activeIndex = activeCol.cards.findIndex((c) => c.id === activeId);
      const overIndex = overCol.cards.findIndex((c) => c.id === overId);

      const newColumns = structuredClone(prev) as ColumnType[];
      const col = newColumns.find((c) => c.id === activeCol.id)!;
      col.cards = arrayMove(col.cards, activeIndex, overIndex);

      return newColumns;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {columns?.map((col) => (
          <Column key={col.id} column={col} setColumns={setColumns} />
        ))}
      </div>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: "0.5",
              },
            },
          }),
        }}
      >
        {activeCard ? (
          <Card card={activeCard} columnId="" setColumns={() => {}} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
