import {
  notificationsActions,
} from "store/slices/notifications";
import { useDispatch } from "react-redux";
import { PostNotification, ToastNotification } from "types/notifications";
const defaultNotification: Omit<ToastNotification, "id"> = {
  type: "INFO",
  title: "Notification",
  text: "System notification",
};
export const useNotification = () => {
  const dispatch = useDispatch();

  /** Creates a toast notification (AKA push notification)
   * - id
   * - title
   * - text
   * - type
   * - imageUrl?
   */
  const toast = (notification: Partial<ToastNotification>) =>
    dispatch(
      notificationsActions.addToast({ ...defaultNotification, ...notification })
    );
  /** Creates a message-type notification which will appear in the notifications page
   * - id
   * - title
   * - text
   * - type
   * - imageUrl?
   * - date?
   * - route?
   */
  const post = (notification: Partial<PostNotification>) =>
    dispatch(
      notificationsActions.addPost({ ...defaultNotification, ...notification })
    );

  const removeToast = (toastId: string) =>
    dispatch(notificationsActions.removeToast(toastId));

  const removePost = (toastId: string) =>
    dispatch(notificationsActions.removeToast(toastId));

  const removeAllPosts = () => {
    dispatch(notificationsActions.removeAllPosts());
  };

  return {
    toast,
    removeToast,
    post,
    removePost,
    removeAllPosts,
  };
};
export default useNotification;
