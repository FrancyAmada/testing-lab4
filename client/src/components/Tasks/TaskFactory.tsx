"use client";
import BasicTask from "./Types/BasicTask";
import TimedTask from "./Types/TimedTask";
import ChecklistTask from "./Types/ChecklistTask";
import { ChecklistItem, NewValues } from "./TaskManager";

interface TaskFactoryProps {
  type: "basic" | "timed" | "checklist";
  contents: {
    id: string;
    title?: string;
    completed?: boolean;
    dueDate?: Date;
    items?: ChecklistItem[];
  };
  functions: {
    onHandleSave: (id: string, { title, completed }: NewValues) => void;
    onHandleDelete: (id: string) => void;
    onHandleAddChecklistItem?: (id: string, newItemText: string) => void;
    onHandleRemoveChecklistItem?: (id: string, itemId: string) => void;
    onHandleToggleChecklistItem?: (id: string, itemId: string) => void;
  };
}

const TaskFactory = ({ type, contents, functions }: TaskFactoryProps) => {
  switch (type) {
    case "basic":
      return (
        <BasicTask
          id={contents.id}
          title={contents.title}
          completed={contents.completed!}
          dueDate={contents.dueDate}
          onHandleSave={functions.onHandleSave}
          onHandleDelete={functions.onHandleDelete}
        />
      );
    case "timed":
      return (
        <TimedTask
          id={contents.id}
          title={contents.title}
          completed={contents.completed!}
          dueDate={contents.dueDate!}
          onHandleSave={functions.onHandleSave}
          onHandleDelete={functions.onHandleDelete}
        />
      );
    case "checklist":
      return (
        <ChecklistTask
          id={contents.id}
          title={contents.title}
          completed={contents.completed!}
          dueDate={contents.dueDate}
          items={contents.items}
          onHandleSave={functions.onHandleSave}
          onHandleDelete={functions.onHandleDelete}
          onHandleAddChecklistItem={functions!.onHandleAddChecklistItem!}
          onHandleRemoveChecklistItem={functions!.onHandleRemoveChecklistItem!}
          onHandleToggleChecklistItem={functions!.onHandleToggleChecklistItem!}
        />
      );
    default:
      return (
        <div className="text-red-700">
          Unknown task type: <span>{type}</span>
        </div>
      );
  }
};

export default TaskFactory;
