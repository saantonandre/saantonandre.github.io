export type ToastNotificationType = "SUCCESS" | "DANGER" | "INFO";
export type ToastNotification = {
  id: string;
  title: string;
  text: string;
  type: ToastNotificationType;
  imageUrl?: string;
};
export type PostNotification = ToastNotification & {
  /** Path to route and route title */
  route?: [string,string];
  date?: Date;
};
