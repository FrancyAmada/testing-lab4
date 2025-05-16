import { useEffect, useState } from "react";
import { Filter, Search, SortAsc, Loader } from "lucide-react";
import { NewValues, Task, TaskManager } from "./components/Tasks/TaskManager";
import TaskFactory from "./components/Tasks/TaskFactory";
import {
  NotificationContainer,
  Notification,
} from "./components/Notification/Notification";
import { useNotifications } from "./hooks/notification/useNotification";
import { initializeTaskOverdueObserver } from "./components/Tasks/TaskOverdueObserver";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] = useState<
    "basic" | "timed" | "checklist"
  >("basic");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState<
    "all" | "active" | "completed"
  >("all");
  const [sortOption, setSortOption] = useState<
    "id" | "name" | "date" | "completion" | "type"
  >("id");
  const [hoursInput, setHoursInput] = useState(1);
  const [minutesInput, setMinutesInput] = useState(0);
  const [dueDateInput, setDueDateInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { notifications, removeNotification, addNotification } =
    useNotifications();

  useEffect(() => {
    const cleanup = initializeTaskOverdueObserver();
    return cleanup;
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      await TaskManager.setFilterOption(filterOption);
      await TaskManager.setSortOption(sortOption);

      const filteredTasks = searchQuery
        ? await TaskManager.searchTasks(searchQuery)
        : TaskManager.getAllTasks();

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      addNotification(
        "Failed to load tasks. Please try again.",
        "error",
        undefined,
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [searchQuery, filterOption, sortOption]);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    setLoading(true);
    try {
      await TaskManager.addTask({
        type: newTaskType,
        props: {
          title: newTaskTitle,
          hours: hoursInput,
          minutes: minutesInput,
          dueDate: dueDateInput ? new Date(dueDateInput) : undefined,
        },
      });

      setNewTaskTitle("");
      setHoursInput(1);
      setMinutesInput(0);
      setDueDateInput("");

      addNotification("Task added successfully!", "success", undefined, 3000);
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      addNotification(
        "Failed to add task. Please try again.",
        "error",
        undefined,
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTask = async (id: string) => {
    setLoading(true);
    try {
      const success = await TaskManager.removeTask(id);

      if (success) {
        addNotification("Task removed successfully!", "success", id, 3000);
        fetchTasks();
      } else {
        addNotification(
          "Failed to remove task. It may have been already deleted.",
          "error",
          id,
          5000
        );
      }
    } catch (error) {
      console.error("Error removing task:", error);
      addNotification(
        "Failed to remove task. Please try again.",
        "error",
        id,
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddChecklistItem = async (taskId: string, text: string) => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await TaskManager.addChecklistItem(taskId, text);
      fetchTasks();
    } catch (error) {
      console.error("Error adding checklist item:", error);
      addNotification(
        "Failed to add checklist item. Please try again.",
        "error",
        taskId,
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChecklistItem = async (taskId: string, itemId: string) => {
    setLoading(true);
    try {
      await TaskManager.removeChecklistItem(taskId, itemId);
      fetchTasks();
    } catch (error) {
      console.error("Error removing checklist item:", error);
      addNotification(
        "Failed to remove checklist item. Please try again.",
        "error",
        taskId,
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (taskId: string, newValues: NewValues) => {
    setLoading(true);
    try {
      if (typeof newValues.title === "string") {
        await TaskManager.updateTaskTitle(taskId, newValues.title);
      }

      if (typeof newValues.completed === "boolean") {
        await TaskManager.toggleTaskCompletion(taskId, newValues.completed);
      }

      if (newValues.hours !== undefined || newValues.minutes !== undefined) {
        await TaskManager.updateTimedTaskDuration(
          taskId,
          newValues.hours ?? 0,
          newValues.minutes ?? 0
        );
      }

      if (newValues.items) {
        for (const item of newValues.items) {
          await TaskManager.updateChecklistItem(taskId, item.id, item.text);
        }
      }

      addNotification("Task updated successfully!", "success", taskId, 3000);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      addNotification(
        "Failed to save task changes. Please try again.",
        "error",
        taskId,
        5000
      );
    } finally {
      setLoading(false);
    }
  };

  const renderTask = (task: Task) => {
    const isOverdue =
      task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    const taskComponent = () => {
      switch (task.type) {
        case "basic":
          return (
            <TaskFactory
              type={task.type}
              contents={{
                id: task.id,
                title: task.title,
                completed: task.completed,
                dueDate: task.dueDate,
              }}
              functions={{
                onHandleSave: handleSaveTask,
                onHandleDelete: handleRemoveTask,
              }}
            />
          );

        case "timed":
          return (
            <TaskFactory
              type={task.type}
              contents={{
                id: task.id,
                title: task.title,
                completed: task.completed,
                dueDate: task.dueDate,
              }}
              functions={{
                onHandleSave: handleSaveTask,
                onHandleDelete: handleRemoveTask,
              }}
            />
          );

        case "checklist":
          return (
            <TaskFactory
              type={task.type}
              contents={{
                id: task.id,
                title: task.title,
                completed: task.completed,
                items: task.items,
                dueDate: task.dueDate,
              }}
              functions={{
                onHandleSave: handleSaveTask,
                onHandleDelete: handleRemoveTask,
                onHandleAddChecklistItem: handleAddChecklistItem,
                onHandleRemoveChecklistItem: handleRemoveChecklistItem,
                onHandleToggleChecklistItem: async (
                  taskId: string,
                  itemId: string
                ) => {
                  try {
                    await TaskManager.toggleChecklistItemCompletion(
                      taskId,
                      itemId
                    );
                    fetchTasks();
                  } catch (error) {
                    console.error("Error toggling checklist item:", error);
                    addNotification(
                      "Failed to update checklist item. Please try again.",
                      "error",
                      undefined,
                      5000
                    );
                  }
                },
              }}
            />
          );

        default:
          return null;
      }
    };

    return (
      <div key={task.id} className="mb-4">
        {isOverdue && (
          <Notification type="error">
            This task is overdue! Due:{" "}
            {new Date(task.dueDate!).toLocaleString()}
          </Notification>
        )}
        {taskComponent()}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <NotificationContainer>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            duration={notification.duration}
            onDismiss={() => removeNotification(notification.id)}
          >
            {notification.message}
          </Notification>
        ))}
      </NotificationContainer>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tasks Manager</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-500 mr-2" />
            <select
              value={filterOption}
              onChange={(e) =>
                setFilterOption(
                  e.target.value as "all" | "active" | "completed"
                )
              }
              className="p-2 border border-gray-300 rounded bg-white"
              disabled={loading}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center">
            <SortAsc size={18} className="text-gray-500 mr-2" />
            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value as
                    | "id"
                    | "name"
                    | "date"
                    | "completion"
                    | "type"
                )
              }
              className="p-2 border border-gray-300 rounded bg-white"
              disabled={loading}
            >
              <option value="id">By ID</option>
              <option value="name">By Name</option>
              <option value="date">By Due Date</option>
              <option value="completion">By Completion</option>
              <option value="type">By Type</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Add New Task
        </h2>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            disabled={loading}
          />

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="mr-2 text-gray-700">Type:</div>
              <select
                value={newTaskType}
                onChange={(e) =>
                  setNewTaskType(
                    e.target.value as "basic" | "timed" | "checklist"
                  )
                }
                className="p-2 border border-gray-300 rounded bg-white"
                disabled={loading}
              >
                <option value="basic">Basic</option>
                <option value="timed">Timed</option>
                <option value="checklist">Checklist</option>
              </select>
            </div>

            {newTaskType === "timed" && (
              <div className="flex items-center">
                <div className="mr-2 text-gray-700">Time:</div>
                <input
                  type="number"
                  min="0"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(parseInt(e.target.value) || 0)}
                  className="w-16 p-2 border border-gray-300 rounded mr-1"
                  disabled={loading}
                />
                <span className="mr-2">h</span>
                <input
                  type="number"
                  min="-1"
                  max="60"
                  value={minutesInput}
                  onChange={(e) =>
                    setMinutesInput(
                      parseInt(e.target.value) < 0
                        ? 59
                        : parseInt(e.target.value) > 59
                        ? 0
                        : parseInt(e.target.value) || 0
                    )
                  }
                  className="w-16 p-2 border border-gray-300 rounded mr-1"
                  disabled={loading}
                />
                <span>m</span>
              </div>
            )}

            {newTaskType !== "timed" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-gray-700">Due Date (optional):</label>
                <input
                  type="datetime-local"
                  className="p-2 border border-gray-800 rounded text-gray-400"
                  style={{ filter: "invert(100%)" }}
                  value={dueDateInput}
                  onChange={(e) => setDueDateInput(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto disabled:bg-blue-300"
            disabled={loading || !newTaskTitle.trim()}
          >
            {TaskManager.isAddTaskLoading() ? (
              <div className="flex items-center justify-center">
                <Loader size={18} className="animate-spin mr-2" />
                Adding...
              </div>
            ) : (
              "Add Task"
            )}
          </button>
        </div>
      </div>

      {loading && tasks.length === 0 && (
        <div className="flex justify-center items-center p-8">
          <Loader size={24} className="animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600">Loading tasks...</span>
        </div>
      )}

      <div className="space-y-2">
        {!loading && tasks.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            {searchQuery
              ? "No tasks match your search"
              : "No tasks yet. Add one above!"}
          </div>
        ) : (
          tasks.map((task) => renderTask(task))
        )}
      </div>
    </div>
  );
};

export default App;
