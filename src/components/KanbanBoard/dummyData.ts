import { ColumnType } from "./types";

export const initialData: ColumnType[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      { id: "1", title: "Create initial project plan" },
      { id: "2", title: "Design landing page" },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    cards: [{ id: "3", title: "Implement authentication" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "4", title: "Write API documentation" }],
  },
];