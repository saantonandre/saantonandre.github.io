import LogoSvg from "assets/logo.svg";
import { twMerge } from "tailwind-merge";

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      alt="Metable logo"
      src={LogoSvg}
      className={twMerge("h-6", className)}
    />
  );
};
