export type BasicTask = {
  type: "basic";
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
};

export type TimedTask = {
  type: "timed";
  dueDate: Date;
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export type ChecklistTask = {
  type: "checklist";
  items: ChecklistItem[];
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
};

export type AddNewTaskProps = {
  type: string;
  props: {
    title?: string;
    hours?: number;
    minutes?: number;
    items?: ChecklistItem[];
    dueDate?: Date;
  };
};

export type NewValues = {
  title?: string;
  completed?: boolean;
  hours?: number;
  minutes?: number;
  items?: ChecklistItem[];
};

export type Task = BasicTask | TimedTask | ChecklistTask;
