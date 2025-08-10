import { Outlet } from "react-router-dom";
import FixedSpaceContainer from "components/containers/FixedSpace";

type Props = {
  asParent?: boolean;
  children?: React.ReactNode;
};
export const OnboardingLayout: React.FC<Props> = ({ asParent, children }) => {
  return (
    <div
      className={
        "relative flex h-screen max-h-screen w-screen flex-col overflow-hidden bg-slate-200 text-slate-700"
      }
    >
      <FixedSpaceContainer>
        {asParent ? children : <Outlet />}
      </FixedSpaceContainer>
      <div className="absolute select-none bottom-2 right-2 text-slate-500">
        placeholder
      </div>
    </div>
  );
};
export default OnboardingLayout;
