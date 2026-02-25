import { useState } from "react";
import { CardType, ColumnType } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, Edit2, Check, GripVertical } from "lucide-react";

interface CardProps {
  card: CardType;
  columnId: string;
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>;
  isOverlay?: boolean;
};

export default function Card({ card, columnId, setColumns, isOverlay }: CardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: editing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const deleteCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== card.id) }
          : col,
      )
    );
  };

  const handleUpdate = () => {
    if (title.trim()) {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                cards: col.cards.map((c) =>
                  c.id === card.id ? { ...c, title } : c
                ),
              }
            : col
        )
      );
      setEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`card ${isOverlay ? "is-overlay" : ""} ${isDragging ? "is-dragging" : ""}`}
    >
      <div className={`card-left-indicator ${columnId}`}></div>
      <div className="card-header">
        {!editing && (
          <div className="drag-handle" {...listeners}>
            <GripVertical size={18} />
          </div>
        )}
        <div className="card-content">
          {editing ? (
            <div className="card-editor">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                onBlur={handleUpdate}
              />
              <button className="icon-btn" onMouseDown={handleUpdate}>
                <Check size={16} />
              </button>
            </div>
          ) : (
            <>
              <p onDoubleClick={() => setEditing(true)}>{title}</p>
              <div className="card-actions">
                <button 
                  className="icon-btn" 
                  onClick={() => setEditing(true)}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="icon-btn delete" 
                  onClick={deleteCard}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}