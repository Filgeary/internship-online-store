import StoreModule from "../module"

export interface IModalsInitState {
  name: string | null
}

class ModalsState extends StoreModule<IModalsInitState> {

  initState(): IModalsInitState {
    return {
      name: null
    }
  }

  open(name: string){
    this.setState({name}, `Открытие модалки ${name}`);
  }

  close(){
    this.setState({name: null}, `Закрытие модалки`);
  }
}

export default ModalsState;
