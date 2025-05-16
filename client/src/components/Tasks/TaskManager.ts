import { v4 as uuidv4 } from "uuid";
import taskApi from "../../api/taskAPI";

export interface BaseTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface BasicTask extends BaseTask {
  type: "basic";
}

export interface TimedTask extends BaseTask {
  type: "timed";
  dueDate: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistTask extends BaseTask {
  type: "checklist";
  items: ChecklistItem[];
}

export interface AddNewTaskProps {
  type: string;
  props: {
    title?: string;
    hours?: number;
    minutes?: number;
    items?: ChecklistItem[];
    dueDate?: Date;
  };
}

export interface NewValues {
  title?: string;
  completed?: boolean;
  hours?: number;
  minutes?: number;
  items?: ChecklistItem[];
}

export type Task = BasicTask | TimedTask | ChecklistTask;

class TaskManagerClass {
  private static instance: TaskManagerClass;
  private tasks: Task[] = [];
  private listeners: (() => void)[] = [];
  private isLoading: boolean = false;
  private searchQueryCache: string = "";
  private filterOptionCache: string = "all";
  private sortOptionCache: string = "id";
  private isAddTaskIsLoading: boolean = false;

  private constructor() {
    this.tasks = [];
    this.refreshTasks();
  }

  public static getInstance(): TaskManagerClass {
    if (!TaskManagerClass.instance) {
      TaskManagerClass.instance = new TaskManagerClass();
    }
    return TaskManagerClass.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  private async refreshTasks(
    query: string = this.searchQueryCache,
    filter: string = this.filterOptionCache,
    sort: string = this.sortOptionCache
  ): Promise<void> {
    this.isLoading = true;
    try {
      this.tasks = await taskApi.getAllTasks(query, filter, sort);
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    } finally {
      this.isLoading = false;
      this.notifyListeners();
    }
  }

  public isLoadingTasks(): boolean {
    return this.isLoading;
  }

  public isAddTaskLoading(): boolean {
    return this.isAddTaskIsLoading;
  }

  public getAllTasks(): Task[] {
    return [...this.tasks];
  }

  public getTasksByType(type: "basic" | "timed" | "checklist"): Task[] {
    return this.tasks.filter((task) => task.type === type);
  }

  public async getTaskById(id: string): Promise<Task | undefined> {
    const cachedTask = this.tasks.find((task) => task.id === id);
    if (cachedTask) return cachedTask;

    return await taskApi.getTaskById(id);
  }

  public async addTask({ type, props }: AddNewTaskProps): Promise<void> {
    this.isAddTaskIsLoading = true;
    const task = await taskApi.addTask({ type, props });
    if (task) {
      this.refreshTasks();
    }
    this.isAddTaskIsLoading = false;
  }

  public async addBasicTask(
    title: string,
    dueDate?: Date
  ): Promise<BasicTask | undefined> {
    const task = await taskApi.addTask({
      type: "basic",
      props: { title, dueDate },
    });
    this.refreshTasks();
    return task as BasicTask | undefined;
  }

  public async addTimedTask(
    title: string,
    hours: number,
    minutes: number
  ): Promise<TimedTask | undefined> {
    const task = await taskApi.addTask({
      type: "timed",
      props: { title, hours, minutes },
    });
    this.refreshTasks();
    return task as TimedTask | undefined;
  }

  public async addChecklistTask(
    title: string,
    items: Omit<ChecklistItem, "id">[] = [],
    dueDate?: Date
  ): Promise<ChecklistTask | undefined> {
    const task = await taskApi.addTask({
      type: "checklist",
      props: {
        title,
        items: items.map((item) => ({
          ...item,
          id: uuidv4(),
        })),
        dueDate,
      },
    });
    this.refreshTasks();
    return task as ChecklistTask | undefined;
  }

  public async updateTaskTitle(
    id: string,
    title: string
  ): Promise<Task | undefined> {
    const updatedTask = await taskApi.updateTaskTitle(id, title);
    this.refreshTasks();
    return updatedTask;
  }

  public async toggleTaskCompletion(
    id: string,
    isCompleted: boolean
  ): Promise<Task | undefined> {
    const updatedTask = await taskApi.toggleTaskCompletion(id, isCompleted);
    this.refreshTasks();
    return updatedTask;
  }

  public async updateTimedTaskDuration(
    id: string,
    hours: number,
    minutes: number
  ): Promise<TimedTask | undefined> {
    const updatedTask = await taskApi.updateTimedTaskDuration(
      id,
      hours,
      minutes
    );
    this.refreshTasks();
    return updatedTask as TimedTask | undefined;
  }

  public async addChecklistItem(
    taskId: string,
    text: string
  ): Promise<ChecklistTask | undefined> {
    const updatedTask = await taskApi.addChecklistItem(taskId, text);
    this.refreshTasks();
    return updatedTask as ChecklistTask | undefined;
  }

  public async updateChecklistItem(
    taskId: string,
    itemId: string,
    text: string
  ): Promise<ChecklistTask | undefined> {
    const updatedTask = await taskApi.updateChecklistItem(taskId, itemId, text);
    this.refreshTasks();
    return updatedTask as ChecklistTask | undefined;
  }

  public async toggleChecklistItemCompletion(
    taskId: string,
    itemId: string
  ): Promise<ChecklistTask | undefined> {
    const updatedTask = await taskApi.toggleChecklistItemCompletion(
      taskId,
      itemId
    );
    this.refreshTasks();
    return updatedTask as ChecklistTask | undefined;
  }

  public async removeChecklistItem(
    taskId: string,
    itemId: string
  ): Promise<ChecklistTask | undefined> {
    const updatedTask = await taskApi.removeChecklistItem(taskId, itemId);
    this.refreshTasks();
    return updatedTask as ChecklistTask | undefined;
  }

  public async removeTask(id: string): Promise<boolean> {
    const success = await taskApi.removeTask(id);
    if (success) {
      this.refreshTasks();
    }
    return success;
  }

  public async searchTasks(query: string): Promise<Task[]> {
    this.searchQueryCache = query;
    await this.refreshTasks(
      query,
      this.filterOptionCache,
      this.sortOptionCache
    );
    return this.tasks;
  }

  public async filterTasksByCompletion(completed: boolean): Promise<Task[]> {
    const filter = completed ? "completed" : "active";
    this.filterOptionCache = filter;
    await this.refreshTasks(
      this.searchQueryCache,
      filter,
      this.sortOptionCache
    );
    return this.tasks;
  }

  public async setFilterOption(
    filter: "all" | "active" | "completed"
  ): Promise<Task[]> {
    this.filterOptionCache = filter;
    await this.refreshTasks(
      this.searchQueryCache,
      filter,
      this.sortOptionCache
    );
    return this.tasks;
  }

  public async setSortOption(
    sort: "id" | "name" | "date" | "completion" | "type"
  ): Promise<Task[]> {
    this.sortOptionCache = sort;
    await this.refreshTasks(
      this.searchQueryCache,
      this.filterOptionCache,
      sort
    );
    return this.tasks;
  }
}

export const TaskManager = TaskManagerClass.getInstance();
