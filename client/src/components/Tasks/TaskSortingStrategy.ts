import { Task } from "./TaskManager";

export class TaskSortingStrategy {
  static sortByDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;

      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  static sortByName(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  static sortById(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
  }

  static sortByCompletion(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
  }

  static sortByType(tasks: Task[]): Task[] {
    const typeOrder = { basic: 1, timed: 2, checklist: 3 };

    return [...tasks].sort((a, b) => {
      return typeOrder[a.type] - typeOrder[b.type];
    });
  }
}
