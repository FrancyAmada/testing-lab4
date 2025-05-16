import { X } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

type NotificationProps = {
  children: ReactNode;
  type?: "info" | "warning" | "error" | "success";
  duration?: number;
  onDismiss?: () => void;
};

export const Notification = ({
  children,
  type = "warning",
  duration,
  onDismiss,
}: NotificationProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: number;
    if (duration) {
      timer = window.setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);
    }
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible) return null;

  const bgColors = {
    info: "bg-blue-100 border-blue-400 text-blue-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    error: "bg-red-100 border-red-400 text-red-700",
    success: "bg-green-100 border-green-400 text-green-700",
  };

  return (
    <div
      className={`p-3 rounded border ${bgColors[type]} flex justify-between items-center mb-2`}
    >
      <div>{children}</div>
      <button
        onClick={handleDismiss}
        className="ml-3 focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const NotificationContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="fixed bottom-4 right-4 w-72 z-50 space-y-2">{children}</div>
  );
};
