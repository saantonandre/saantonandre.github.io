import NotificationToast from "components/notifications/Toast";
import useNotification from "hooks/useNotification";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { notificationsSelectors } from "store/slices/notifications";

const notificationsRoot = document.getElementById("notifications-root");
/** [title, text, type, imageUrl] */
export const NotificationsContainer: React.FC = () => {
  const { removeToast } = useNotification();
  const toasts = useSelector(notificationsSelectors.toasts);
  if (!notificationsRoot) return <></>;
  return createPortal(
    <div className="no-scrollbar fixed bottom-0 right-0 z-[60] flex flex-col justify-end gap-3 overflow-hidden p-3">
      {toasts.map((notification) => (
        <NotificationToast
          key={notification.id}
          {...{ ...notification }}
          remove={() => removeToast(notification.id)}
        />
      ))}
    </div>,
    notificationsRoot
  );
};

export default NotificationsContainer