import { useState } from "react";
import { ColumnType } from "./types";
import Card from "./Card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import AddCardModal from "./AddCardModal";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
  column: ColumnType;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
};

export default function Column({ column, setColumns }: ColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodeRef } = useDroppable({
    id: column?.id,
  });

  const handleAddCard = (title: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === column.id
          ? {
              ...col,
              cards: [...col.cards, { id: Date.now().toString(), title }],
            }
          : col,
      ),
    );
  };

  return (
    <div className="column">
      <div className={`column-header ${column?.id === "todo" ? "todo" : column?.id === "progress" ? "progress" : "done"}`}>
        <h3>{column.title}</h3>
        <div className="column-header-count"><p>{column?.cards?.length || 0}</p></div>
      </div>
      <div className="card-content-wrapper">
        <div className="add-button-wrapper">
      <button className="add-card-btn" onClick={() => setIsModalOpen(true)}>
        <Plus size={18} />
        Add Task
      </button>
      </div>

      <div ref={setNodeRef} className="cards-container">
        <SortableContext
          items={column?.cards?.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column?.cards?.length === 0 ? (
            <div className="empty-state">No task available</div>
          ) : (
            column?.cards?.map((card) => (
              <Card
                key={card.id}
                card={card}
                columnId={column.id}
                setColumns={setColumns}
              />
            ))
          )}
        </SortableContext>
      </div>
</div>
      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCard}
        columnTitle={column.title}
      />
    </div>
  );
}
