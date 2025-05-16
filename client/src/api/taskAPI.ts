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

const processDates = (task: any): Task => {
  const processedTask = { ...task };

  if (task.createdAt) {
    processedTask.createdAt = new Date(task.createdAt);
  }

  if (task.updatedAt) {
    processedTask.updatedAt = new Date(task.updatedAt);
  }

  if (task.dueDate) {
    processedTask.dueDate = new Date(task.dueDate);
  }

  return processedTask as Task;
};

export const taskApi = {
  getAllTasks: async (
    query = "",
    filter = "all",
    sort = "id"
  ): Promise<Task[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (query) queryParams.append("query", query);
      if (filter !== "all") queryParams.append("filter", filter);
      if (sort !== "id") queryParams.append("sort", sort);

      const queryString = queryParams.toString();
      const url = `${import.meta.env.VITE_SERVER_URL}/api/tasks${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const data = await response.json();
      return data.map(processDates);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  },

  getTaskById: async (id: string): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks/${id}`
      );
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to fetch task");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return undefined;
    }
  },

  addTask: async ({
    type,
    props,
  }: AddNewTaskProps): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, props }),
        }
      );

      if (!response.ok) throw new Error("Failed to add task");

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error("Error adding task:", error);
      return undefined;
    }
  },

  updateTaskTitle: async (
    id: string,
    title: string
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks/${id}/title`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to update task title");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(`Error updating task ${id} title:`, error);
      return undefined;
    }
  },

  toggleTaskCompletion: async (
    id: string,
    completed: boolean
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks/${id}/completion`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to toggle task completion");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(`Error toggling task ${id} completion:`, error);
      return undefined;
    }
  },

  updateTimedTaskDuration: async (
    id: string,
    hours: number,
    minutes: number
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks/${id}/duration`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hours, minutes }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to update timed task duration");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(`Error updating timed task ${id} duration:`, error);
      return undefined;
    }
  },

  addChecklistItem: async (
    taskId: string,
    text: string
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks/${taskId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to add checklist item");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(`Error adding checklist item to task ${taskId}:`, error);
      return undefined;
    }
  },

  updateChecklistItem: async (
    taskId: string,
    itemId: string,
    text: string
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/tasks/${taskId}/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to update checklist item");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(
        `Error updating checklist item ${itemId} in task ${taskId}:`,
        error
      );
      return undefined;
    }
  },

  toggleChecklistItemCompletion: async (
    taskId: string,
    itemId: string
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/tasks/${taskId}/items/${itemId}/completion`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to toggle checklist item completion");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(
        `Error toggling checklist item ${itemId} completion in task ${taskId}:`,
        error
      );
      return undefined;
    }
  },

  removeChecklistItem: async (
    taskId: string,
    itemId: string
  ): Promise<Task | undefined> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/tasks/${taskId}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to remove checklist item");
      }

      const data = await response.json();
      return processDates(data);
    } catch (error) {
      console.error(
        `Error removing checklist item ${itemId} from task ${taskId}:`,
        error
      );
      return undefined;
    }
  },

  removeTask: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        if (response.status === 404) return false;
        throw new Error("Failed to remove task");
      }

      return true;
    } catch (error) {
      console.error(`Error removing task ${id}:`, error);
      return false;
    }
  },

  searchTasks: async (query: string): Promise<Task[]> => {
    return taskApi.getAllTasks(query);
  },

  filterTasksByCompletion: async (completed: boolean): Promise<Task[]> => {
    const filter = completed ? "completed" : "active";
    return taskApi.getAllTasks("", filter);
  },
};

export default taskApi;
