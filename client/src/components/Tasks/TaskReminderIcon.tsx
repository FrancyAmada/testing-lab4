import { differenceInMinutes } from "date-fns";

interface TaskReminderIconProps {
  dueDate: Date;
}

const getReminderColor = (dueDate: Date) => {
  const now = new Date();
  const minutesLeft =
    (new Date(dueDate).getTime() - now.getTime()) / (60 * 1000);

  if (minutesLeft <= 0) return "bg-red-500 text-white";
  if (minutesLeft <= 30) return "bg-orange-400 text-white";
  return "bg-yellow-300 text-black";
};

const TaskReminderIcon = ({ dueDate }: TaskReminderIconProps) => {
  const reminderColor = getReminderColor(dueDate);
  return (
    <div
      className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${reminderColor}`}
    >
      {new Date() > new Date(dueDate)
        ? "Overdue"
        : differenceInMinutes(new Date(dueDate), new Date()) <= 30
        ? "Soon"
        : "Upcoming"}
    </div>
  );
};

export default TaskReminderIcon;
