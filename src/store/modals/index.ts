import StoreModule from "../module";
import { IModalsInitState } from "./types";


class ModalsState extends StoreModule {

  initState(): IModalsInitState {
    return {
      name: null
    }
  }

  open(name){
    this.setState({name}, `Открытие модалки ${name}`);
  }

  close(){
    this.setState({name: null}, `Закрытие модалки`);
  }
}

export default ModalsState;
