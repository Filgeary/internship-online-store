import { Actions } from "@src/containers/draw/type";
import { FigureType } from "../canvas/type";

export type PanelPropsType = {
  action: Actions;
  setAction: React.Dispatch<React.SetStateAction<Actions>>;
  options: {
    value: number;
    title: string;
  }[];
  figures: FiguresType[];
  labelFill: string;
  labelDraw: string;
};

export type FiguresType = {
  title: FigureType;
  icon: JSX.Element;
};
