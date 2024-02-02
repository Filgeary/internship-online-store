import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";

class ModalsState extends StoreModule {

  initState() {
    return {
      list: [],
      events: [],
      lastOpenModalId: 0
    }
  }

  open(name){
    return new Promise((resolve) => {
      const id = codeGenerator(this.getState().lastOpenModalId)();
      this.setState(
        {
          ...this.getState(),
          list: [...this.getState().list, { name, id }],
          events: [...this.getState().events, { name, id, resolve }],
          lastOpenModalId: id,
        },
        `Открытие модалки ${name}`
      );
    }
    );
  }

  close(name, id, data = []){
    if (data.length) {
      const { resolve } = this.getState().events.find(item => item.name === name && item.id === id);
      resolve(data);
    }

    const list = this.getState().list.filter(
      (item) => item.name !== name && item.id !== id
    );
    const events = this.getState().events.filter(
      (item) => item.name !== name && item.id !== id
    );

    this.setState(
      {
        ...this.getState(),
        list,
        events,
      },
      `Закрытие модалки`
    );
  }
}

export default ModalsState;
