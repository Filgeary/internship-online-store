import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";

class ModalsState extends StoreModule {

  initState() {
    return {
      list: [],
      events: new Map(),
      lastOpenModalId: 0
    }
  }

  open(name){
    return new Promise((resolve) => {
      const id = codeGenerator(this.getState().lastOpenModalId)();
      this.getState().events.set(id, resolve);
      this.setState(
        {
          ...this.getState(),
          list: [...this.getState().list, { name, id }],
          lastOpenModalId: id,
        },
        `Открытие модалки ${name}`
        );
      });
  }

  close(id, data){
    if (data) {
      const resolve = this.getState().events.get(id);
      resolve(data);
    }

    this.getState().events.delete(id);
    const list = this.getState().list.filter(
      (item) => item.id !== id
    );

    this.setState(
      {
        ...this.getState(),
        list,
      },
      `Закрытие модалки`
    );
  }
}

export default ModalsState;
