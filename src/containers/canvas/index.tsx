import { memo} from "react";
import SideLayout from "@src/components/side-layout";
import CanvasDraw from "@src/components/canvas-draw";


const Canvas = () => {
  return (
    <SideLayout padding="medium">
      <CanvasDraw />
    </SideLayout>
  );
};

export default memo(Canvas);
