import {TState} from "../src/types/type.ts";
import Services from "../src/services.ts"

export type TRender = ({ path }: { path: string }) => {
  app: JSX.Element;
  services: Services;
};
