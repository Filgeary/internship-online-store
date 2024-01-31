import StoreModule from "../module";

class ModalsState extends StoreModule {

  initState() {
    return {
      list: [],
      events: []
    }
  }

  open(name){
    return new Promise((resolve, reject) =>
      this.setState(
        { ...this.getState(),
          list: [...this.getState().list, name],
          events: [...this.getState().events, {resolve, reject}] },
        `Открытие модалки ${name}`
      )
    );
  }

  close(data = []){
    if (data.length) {
      const { resolve, reject } = this.getState().events.at(-1);
      resolve(data);
      reject("Что-то пошло не так!");
    }

    this.setState(
      {
        ...this.getState(),
        list: this.getState().list.slice(0, -1),
        events: this.getState().events.slice(0, -1),
      },
      `Закрытие модалки`
    );
  }
}

export default ModalsState;
