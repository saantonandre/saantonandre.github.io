import { XMarkIcon } from "@heroicons/react/24/outline";
import TransparentButton from "components/buttons/Transparent";
import ImageDiv from "components/others/ImageDiv";
import ProgressCountDown from "components/others/Progress/CountDown";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ToastNotification } from "types/notifications";

/** Returns text and bg tailwind color classes (text,bg) depending on the notification type */
const twTypeColors = (type?: ToastNotification["type"]): [string, string] => {
  switch (type) {
    case "SUCCESS":
      return ["text-primary", "bg-primary"];
    case "DANGER":
      return ["text-danger", "bg-danger"];
    default:
      return ["text-neutral", "bg-neutral"];
  }
};

type Props = {
  duration?: number;
  remove?: () => void;
  className?: string;
} & ToastNotification;
export const NotificationToast: React.FC<Props> = ({
  title,
  text,
  imageUrl,
  type,
  className,
  duration = 5,
  remove,
}) => {
  const typeColors = twTypeColors(type);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);
  const [scheduledDeletion, setScheduledDeletion] = useState(false);
  return (
    <div
      className={twMerge(
        "flex text-contrast dark:text-d-contrast w-80 grow animate-fade-in-height flex-col overflow-hidden rounded-2xl bg-neutral2 dark:bg-d-neutral2 shadow-lg",
        className,
        scheduledDeletion && "opacity-0 transition-opacity"
      )}
      onMouseEnter={() => setIsCountdownPaused(true)}
      onMouseLeave={() => setIsCountdownPaused(false)}
      onTransitionEnd={(e) => {
        if (remove && scheduledDeletion) {
          remove();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 overflow-hidden text-sm bg-neutral dark:bg-d-neutral3">
        {/* Title */}
        <div
          className={twMerge("overflow-ellipsis font-medium", typeColors[0])}
        >
          {title}
        </div>
        {/* CloseButton */}
        <TransparentButton
          onClick={() => setScheduledDeletion(true)}
          className="h-6 p-5 px-4 -m-4 rounded-l-none hover:bg-neutral2 dark:hover:bg-d-neutral2"
        >
          Chiudi <XMarkIcon className="h-4" />
        </TransparentButton>
      </div>
      {/* Body */}
      <div className="flex gap-3 px-4 py-2 text-sm">
        {/* Image (optional) */}
        {imageUrl && (
          <ImageDiv className="w-12 h-12 rounded-lg" src={imageUrl} />
        )}
        {/* Description */}
        <div className="w-full">{text}</div>
      </div>
      {/* Footer (progress bar) */}
      <div className="px-4 pb-3">
        <ProgressCountDown
          handleEnd={() => setScheduledDeletion(true)}
          duration={duration}
          className={typeColors[1]}
          paused={isCountdownPaused}
        />
      </div>
    </div>
  );
};

export default NotificationToast;
