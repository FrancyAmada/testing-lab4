type NotificationType = "info" | "warning" | "error" | "success";

export interface NotificationData {
  id: string;
  message: string;
  type: NotificationType;
  taskId?: string;
  timestamp: number;
  duration?: number;
}

type NotificationObserver = (notifications: NotificationData[]) => void;

class NotificationManagerClass {
  private notifications: NotificationData[] = [];
  private observers: NotificationObserver[] = [];
  private static instance: NotificationManagerClass;

  private constructor() {}

  public static getInstance(): NotificationManagerClass {
    if (!NotificationManagerClass.instance) {
      NotificationManagerClass.instance = new NotificationManagerClass();
    }
    return NotificationManagerClass.instance;
  }

  public subscribe(observer: NotificationObserver): () => void {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((obs) => obs !== observer);
    };
  }

  private notifyObservers(): void {
    this.observers.forEach((observer) => observer([...this.notifications]));
  }

  public addNotification(
    message: string,
    type: NotificationType = "info",
    taskId?: string,
    duration?: number
  ): string {
    const id = `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const notification: NotificationData = {
      id,
      message,
      type,
      taskId,
      timestamp: Date.now(),
      duration,
    };

    this.notifications.push(notification);
    this.notifyObservers();

    if (duration) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }

    return id;
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    );
    this.notifyObservers();
  }

  public removeTaskNotifications(taskId: string): void {
    this.notifications = this.notifications.filter(
      (notification) => notification.taskId !== taskId
    );
    this.notifyObservers();
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.notifyObservers();
  }

  public getNotifications(): NotificationData[] {
    return [...this.notifications];
  }
}

export const NotificationManager = NotificationManagerClass.getInstance();
