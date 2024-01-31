import StoreModule from "../module";

class ModalsState extends StoreModule {

  initState() {
    return {
      list: [],
      resolve: new Map()
    }
  }

  open(name){
    this.setState({...this.getState(), list: [...this.getState().list, name]}, `Открытие модалки ${name}`);
    
  }

  close(name = '', data = []){
    if(!!data.length && name) {
      const resolve = this.getState().resolve.get(name);
      resolve(data);
      this.getState().resolve.delete(name);
    }

    this.setState(
      {
        ...this.getState(),
        list: this.getState().list.slice(0, -1),
      },
      `Закрытие модалки`
    );
  }

    resolve(name, resolve) {
      this.setState({
        ...this.getState(),
        resolve: this.getState().resolve.set(name, resolve),
      });
    }
}

export default ModalsState;
