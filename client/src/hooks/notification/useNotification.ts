import { useEffect, useState } from "react";
import {
  NotificationData,
  NotificationManager,
} from "../../components/Notification/NotificationManager";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe(
      (updatedNotifications) => {
        setNotifications(updatedNotifications);
      }
    );

    setNotifications(NotificationManager.getNotifications());

    return unsubscribe;
  }, []);

  return {
    notifications,
    addNotification:
      NotificationManager.addNotification.bind(NotificationManager),
    removeNotification:
      NotificationManager.removeNotification.bind(NotificationManager),
    clearAllNotifications:
      NotificationManager.clearAllNotifications.bind(NotificationManager),
  };
};
