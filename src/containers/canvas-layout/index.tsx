import { memo, useState } from "react";
import SideLayout from "../../components/side-layout";
import CanvasTool from "../../components/canvas-tool";
import CanvasDisplay from "../../components/canvas-display";

export type CanvasAction = {
  type: "clear" | "triangle" | "square" | "circle" | "line";
  color?: string;
  lineWidth?: number;
}

function CanvasLayout() {
  const [currentAction, setCurrentAction] = useState<CanvasAction>({type: "clear", color: "#000", lineWidth: 5});

  return (
    <SideLayout
      side={"between"}
      padding={"small"}
      direction={"column"}
      alignItems={"stretch"}
    >
      <div>{`Выбранный режим: ${currentAction?.type || "Нет режима"}`}</div>
      <CanvasTool currentAction={currentAction} changeActionType={setCurrentAction} />
      <CanvasDisplay canvasAction={currentAction} />
    </SideLayout>
  );
}

export default memo(CanvasLayout);
