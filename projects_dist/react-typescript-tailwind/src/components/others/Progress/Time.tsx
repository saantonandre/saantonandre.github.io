import ProgressBar from "components/others/Progress/Bar";
import { relativeTimeFromDates } from "utils/dateFormatter";

type Props = {
  from: string; // a date string
  to: string; // a date string
};
export const ProgressTime: React.FC<
  Props & typeof ProgressBar.defaultProps
> = ({ from, to, ...progressProps }) => {
  const unixFrom = new Date(from).getTime();
  const unixTo = new Date(to).getTime();
  const now = new Date().getTime() - unixFrom;
  const end = unixTo - unixFrom;
  const progress = Math.round((now / end) * 1000) / 10;
  const formattedProgress =
    progress > 0 ? (progress > 100 ? 100 : progress) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-500">
        <div>
          {(() => {
            const relativeTime = relativeTimeFromDates(new Date(from));
            if (!formattedProgress) {
              return "Inizierà " + relativeTime;
            }
            if (formattedProgress >= 100) {
              return "Conclusa " + relativeTime;
            }
            return "In corso";
          })()}
        </div>
        <div>{formattedProgress}%</div>
      </div>
      <ProgressBar value={formattedProgress} className="bg-[#3DD598]" {...progressProps} />
    </div>
  );
};
