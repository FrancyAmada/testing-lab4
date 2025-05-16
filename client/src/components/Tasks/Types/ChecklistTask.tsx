"use client";

import { Check, Clock, Edit2, Plus, Save, Trash } from "lucide-react";
import { useState } from "react";
import { ChecklistItem, NewValues } from "../TaskManager";
import TaskReminderIcon from "../TaskReminderIcon";

interface ChecklistTaskProps {
  id: string;
  title?: string;
  completed: boolean;
  dueDate?: Date;
  items?: ChecklistItem[];
  onHandleSave: (id: string, { title, completed }: NewValues) => void;
  onHandleDelete: (id: string) => void;
  onHandleAddChecklistItem: (id: string, newItemText: string) => void;
  onHandleRemoveChecklistItem: (id: string, itemId: string) => void;
  onHandleToggleChecklistItem: (id: string, itemId: string) => void;
}

const ChecklistTask = ({
  id,
  title,
  completed,
  dueDate,
  items,
  onHandleSave,
  onHandleDelete,
  onHandleAddChecklistItem,
  onHandleRemoveChecklistItem,
  onHandleToggleChecklistItem,
}: ChecklistTaskProps) => {
  const [taskText, setTaskText] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isDone, setIsDone] = useState(completed);
  const [editValue, setEditValue] = useState(taskText);
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState("");

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

  const startEditingItem = (itemId: string, currentText: string) => {
    setEditingItemId(itemId);
    setEditingItemText(currentText);
  };

  const handleSave = () => {
    setTaskText(editValue);
    setIsEditing(false);
    onHandleSave(id, {
      title: editValue,
      completed: isDone,
    });
  };

  const saveEditingItem = (itemId: string) => {
    const updatedItems = (items ?? []).map((item) => {
      if (item.id === itemId) {
        return { ...item, text: editingItemText };
      }
      return item;
    });
    onHandleSave(id, {
      items: updatedItems,
    });
    setEditingItemId(null);
    setEditingItemText("");
  };

  const toggleChecklistItem = (itemId: string) => {
    onHandleToggleChecklistItem(id, itemId);
  };

  const handleAddChecklistItem = () => {
    if (!newItemText.trim()) return;
    onHandleAddChecklistItem(id, newItemText);
    setNewItemText("");
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    onHandleRemoveChecklistItem(id, itemId);
  };

  const completedCount = (items ?? []).filter((item) => item.completed).length;
  const totalItems = (items ?? []).length;
  const progress =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

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
            onClick={() => setIsDone(!isDone)}
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
              className="flex-1 p-1 border border-gray-300 rounded text-black"
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
      <div className="bg-gray-200 rounded-full h-2 mt-2 mb-3">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="ml-9 space-y-2">
        {(items ?? []).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                  item.completed
                    ? "bg-blue-500 text-white"
                    : "border border-gray-300"
                }`}
              >
                {item.completed && <Check size={14} />}
              </button>
              {editingItemId === item.id ? (
                <input
                  type="text"
                  value={editingItemText}
                  onChange={(e) => setEditingItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditingItem(item.id);
                    if (e.key === "Escape") setEditingItemId(null);
                  }}
                  onBlur={() => saveEditingItem(item.id)}
                  className="text-sm p-1 border border-gray-300 rounded text-black"
                  autoFocus
                />
              ) : (
                <span
                  className={`text-sm ${
                    item.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-700"
                  }`}
                >
                  {item.text}
                </span>
              )}
            </div>

            <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
              {editingItemId === item.id ? (
                <button
                  onClick={() => saveEditingItem(item.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Save size={18} />
                </button>
              ) : (
                <button
                  onClick={() => startEditingItem(item.id, item.text)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Edit2 size={14} />
                </button>
              )}
              <button
                onClick={() => handleRemoveChecklistItem(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new checklist item */}
      <div className="ml-9 mt-3 flex items-center">
        <input
          type="text"
          placeholder="Add new item"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 p-1 text-sm border border-gray-300 rounded mr-2 text-black"
          onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem()}
        />
        <button
          onClick={handleAddChecklistItem}
          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChecklistTask;
