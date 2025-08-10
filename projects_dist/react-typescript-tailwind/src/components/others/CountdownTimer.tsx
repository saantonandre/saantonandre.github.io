import { useEffect, useState } from "react";

type Props = {
  expireTime: number;
  setIsExpired: (value:boolean)=>void
};
export const CountdownTimer: React.FC<Props> = ({
  expireTime,
  setIsExpired,
}) => {
  const [time, setTime] = useState(Math.floor((expireTime - Date.now()) / 1000) + "s");
  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsExpired(expireTime - Date.now()<=0)
        setTime(Math.floor((expireTime - Date.now()) / 1000) + "s")},
      1000
    );

    return () => clearInterval(interval);
  },[expireTime,setIsExpired]);

  return <span>{time}</span>;
};
export default CountdownTimer;
