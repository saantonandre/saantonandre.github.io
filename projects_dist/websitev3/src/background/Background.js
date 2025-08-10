import React, { useRef } from "react";
import { StarsService } from "./stars_background";
const Background = () => {
  const canvasElement = useRef();

  React.useEffect(() => {
    const starService = new StarsService(canvasElement.current);
    starService.init();
  }, []);

  return (
    <div
      style={{ zIndex: -100 }}
      className="position-fixed h-100 w-100"
    >
      <canvas className="bg-spaceblue" ref={canvasElement} />
    </div>
  );
};

export default Background;
