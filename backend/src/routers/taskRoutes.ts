import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { ChecklistItem, Task } from "../types/task";

const router = Router();

// Mock Data
// {
//     id: uuidv4(),
//     type: "basic",
//     title: "Complete project documentation",
//     completed: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: uuidv4(),
//     type: "timed",
//     title: "Prepare presentation",
//     dueDate: new Date(new Date().getTime() + (0 * 60 + 30) * 60 * 1000),
//     completed: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: uuidv4(),
//     type: "checklist",
//     title: "Website Redesign",
//     items: [
//       { id: uuidv4(), text: "Design mockup", completed: true },
//       { id: uuidv4(), text: "Get client routerroval", completed: false },
//       { id: uuidv4(), text: "Implement design", completed: false },
//     ],
//     completed: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },

let tasks: Task[] = [];

// GET ALL TASK
router.get("/", (req, res) => {
  const { query, filter, sort } = req.query;

  let filteredTasks = [...tasks];

  if (query) {
    const lowerQuery = query.toString().toLowerCase();
    filteredTasks = filteredTasks.filter((task) => {
      if (task.title.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      if (task.type === "checklist") {
        return task.items.some((item) =>
          item.text.toLowerCase().includes(lowerQuery)
        );
      }

      return false;
    });
  }

  if (filter === "active") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (sort) {
    switch (sort) {
      case "name":
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        filteredTasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "completion":
        filteredTasks.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
        break;
      case "type":
        filteredTasks.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case "id":
      default:
        filteredTasks.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }
  }

  res.json(filteredTasks);
});

router.get("/:id", (req: any, res: any) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
});

// CREATE NEW TASK
router.post("/", (req: any, res: any) => {
  const { type, props } = req.body;

  let newTask: Task;
  const now = new Date();

  switch (type) {
    case "basic":
      newTask = {
        id: uuidv4(),
        type: "basic",
        title: props.title || "New Task",
        completed: false,
        createdAt: now,
        updatedAt: now,
        dueDate: props.dueDate ? new Date(props.dueDate) : undefined,
      };
      break;

    case "timed":
      const hours = props.hours || 0;
      const minutes = props.minutes || 0;
      const dueDate = new Date(
        now.getTime() + (hours * 60 + minutes) * 60 * 1000
      );

      newTask = {
        id: uuidv4(),
        type: "timed",
        title: props.title || "New Timed Task",
        completed: false,
        createdAt: now,
        updatedAt: now,
        dueDate: dueDate,
      };
      break;

    case "checklist":
      newTask = {
        id: uuidv4(),
        type: "checklist",
        title: props.title || "New Checklist",
        completed: false,
        items: (props.items || []).map((item: ChecklistItem) => ({
          ...item,
          id: uuidv4(),
          completed: item.completed || false,
        })),
        createdAt: now,
        updatedAt: now,
        dueDate: props.dueDate ? new Date(props.dueDate) : undefined,
      };
      break;

    default:
      return res.status(400).json({ error: "Invalid task type" });
  }

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// UPDATE A SPECIFIC TASK
router.put("/:id", (req: any, res: any) => {
  const { id } = req.params;
  const updates = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = tasks[taskIndex];
  const updatedTask = { ...task, ...updates, updatedAt: new Date() };

  if (task.type === "checklist" && updates.items) {
    updatedTask.items = updates.items;
    updatedTask.completed = updatedTask.items.every(
      (item: ChecklistItem) => item.completed
    );
  }

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// UPDATE THE TITLE OF A SPECIFIC TASK
router.patch("/:id/title", (req: any, res: any) => {
  const { id } = req.params;
  const { title } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

// TOGGLE THE COMPLETION OF A SPECIFIC TASK
router.patch("/:id/completion", (req: any, res: any) => {
  const { id } = req.params;
  const { completed } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

// UPDATE THE DURATION OF A TIMED TASK
router.patch("/:id/duration", (req: any, res: any) => {
  const { id } = req.params;
  const { hours, minutes } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1 || tasks[taskIndex].type !== "timed") {
    return res.status(404).json({ error: "Timed task not found" });
  }

  const task = tasks[taskIndex];
  const now = new Date();
  const dueDate = new Date(now.getTime() + (hours * 60 + minutes) * 60 * 1000);

  tasks[taskIndex] = {
    ...task,
    dueDate,
    updatedAt: now,
  };

  res.json(tasks[taskIndex]);
});

// ADD A CHECKLIST ITEM FOR A CHECKLIST TASK
router.post("/:id/items", (req: any, res: any) => {
  const { id } = req.params;
  const { text } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1 || tasks[taskIndex].type !== "checklist") {
    return res.status(404).json({ error: "Checklist task not found" });
  }

  const task = tasks[taskIndex];
  const newItem = {
    id: uuidv4(),
    text,
    completed: false,
  };

  tasks[taskIndex] = {
    ...task,
    items: [...task.items, newItem],
    updatedAt: new Date(),
  };

  res.status(201).json(tasks[taskIndex]);
});

// UPDATE A CHECKLIST ITEM OF A SPECIFIC CHECKLIST TASK
router.put("/:taskId/items/:itemId", (req: any, res: any) => {
  const { taskId, itemId } = req.params;
  const { text } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1 || tasks[taskIndex].type !== "checklist") {
    return res.status(404).json({ error: "Checklist task not found" });
  }

  const task = tasks[taskIndex];
  const itemIndex = task.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Checklist item not found" });
  }

  const updatedItems = [...task.items];
  updatedItems[itemIndex] = {
    ...updatedItems[itemIndex],
    text,
  };

  tasks[taskIndex] = {
    ...task,
    items: updatedItems,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

// TOGGLE THE COMPLETION OF A CHECKLIST ITEM FOR A SPECIFIC TASK
router.patch("/:taskId/items/:itemId/completion", (req: any, res: any) => {
  const { taskId, itemId } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1 || tasks[taskIndex].type !== "checklist") {
    return res.status(404).json({ error: "Checklist task not found" });
  }

  const task = tasks[taskIndex];
  const itemIndex = task.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ error: "Checklist item not found" });
  }

  const updatedItems = [...task.items];
  updatedItems[itemIndex] = {
    ...updatedItems[itemIndex],
    completed: !updatedItems[itemIndex].completed,
  };

  const allCompleted = updatedItems.every((item) => item.completed);

  tasks[taskIndex] = {
    ...task,
    items: updatedItems,
    completed: allCompleted,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

// DELETE A SPECIFIC CHECKLIST ITEM FROM A SPECIFIC CHECKLIST TASK
router.delete("/:taskId/items/:itemId", (req: any, res: any) => {
  const { taskId, itemId } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1 || tasks[taskIndex].type !== "checklist") {
    return res.status(404).json({ error: "Checklist task not found" });
  }

  const task = tasks[taskIndex];
  const updatedItems = task.items.filter((item) => item.id !== itemId);

  tasks[taskIndex] = {
    ...task,
    items: updatedItems,
    updatedAt: new Date(),
  };

  res.json(tasks[taskIndex]);
});

// DELETE A SPECIFIC TASK
router.delete("/:id", (req: any, res: any) => {
  const { id } = req.params;
  const initialLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json({ message: "Task deleted successfully" });
});

export default router;
