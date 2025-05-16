import { TaskManager } from "./TaskManager";
import { NotificationManager } from "../Notification/NotificationManager";
import { Task } from "./TaskManager";

const overdueNotifiedTasks = new Map<string, boolean>();

export const checkOverdueTasks = () => {
  const tasks = TaskManager.getAllTasks();
  const now = new Date();

  tasks.forEach((task: Task) => {
    if (!task.dueDate || task.completed) {
      if (task.completed && overdueNotifiedTasks.has(task.id)) {
        NotificationManager.removeTaskNotifications(task.id);
        overdueNotifiedTasks.delete(task.id);
      }
      return;
    }

    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < now;

    if (isOverdue && !overdueNotifiedTasks.has(task.id)) {
      NotificationManager.addNotification(
        `Task "${task.title}" is overdue! Due: ${dueDate.toLocaleString()}`,
        "error",
        task.id
      );

      overdueNotifiedTasks.set(task.id, true);
    } else if (!isOverdue && overdueNotifiedTasks.has(task.id)) {
      NotificationManager.removeTaskNotifications(task.id);
      overdueNotifiedTasks.delete(task.id);
    }
  });
};

export const initializeTaskOverdueObserver = () => {
  TaskManager.subscribe(checkOverdueTasks);

  checkOverdueTasks();

  const intervalId = setInterval(checkOverdueTasks, 60000);

  return () => {
    clearInterval(intervalId);
  };
};
