import StoreModule from "../module";
import { IModalsState } from "./types";

class ModalsState extends StoreModule<IModalsState> {
  initState(): IModalsState {
    return {
      name: null,
    };
  }

  open(name: string) {
    this.setState({ name }, `Открытие модалки ${name}`);
  }

  close() {
    this.setState({ name: null }, `Закрытие модалки`);
  }
}

export default ModalsState;
