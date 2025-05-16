"use client";

import { Check, Clock, Edit2, Save, Trash } from "lucide-react";
import { useState } from "react";
import { NewValues } from "../TaskManager";
import TaskReminderIcon from "../TaskReminderIcon";

interface BasicTaskProps {
  id: string;
  title?: string;
  completed: boolean;
  dueDate?: Date;
  onHandleSave: (id: string, { title, completed }: NewValues) => void;
  onHandleDelete: (id: string) => void;
}

const BasicTask = ({
  id,
  title,
  completed,
  dueDate,
  onHandleSave,
  onHandleDelete,
}: BasicTaskProps) => {
  const [taskText, setTaskText] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isDone, setIsDone] = useState(completed);
  const [editValue, setEditValue] = useState(taskText);

  const formattedDate = new Date(dueDate ?? "").toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = new Date(dueDate ?? "").toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(taskText);
  };

  const handleSave = () => {
    setTaskText(editValue);
    setIsEditing(false);
    onHandleSave(id, { title: taskText, completed: isDone });
  };

  const setCompleted = () => {
    onHandleSave(id, { title: taskText, completed: !isDone });
    setIsDone(!isDone);
  };

  return (
    <div
      className={`relative p-4 rounded-lg border ${
        isDone ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
      } shadow-sm mb-4`}
    >
      {dueDate ? <TaskReminderIcon dueDate={dueDate!} /> : null}
      <div
        className={`flex items-center justify-between ${dueDate ? "pt-3" : ""}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={setCompleted}
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isDone ? "bg-green-500 text-white" : "border border-gray-300"
            }`}
          >
            {isDone && <Check size={16} />}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 p-1 border border-gray-300 rounded text-black w-full"
              autoFocus
            />
          ) : (
            <span
              className={`font-medium ${
                isDone ? "text-gray-500 line-through" : "text-gray-800"
              }`}
            >
              {taskText}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-blue-500 hover:text-blue-700"
            >
              <Save size={18} />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              <Edit2 size={18} />
            </button>
          )}
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => onHandleDelete(id)}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>
      {dueDate ? (
        <div className="flex items-center text-sm text-gray-600 ml-9">
          <Clock size={14} className="mr-1" />
          <div className="flex items-center ml-2">
            <span>
              Due Date: {formattedDate} at {formattedTime}
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default BasicTask;
