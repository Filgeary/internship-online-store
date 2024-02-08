import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";
import type { InitialStateModals, NameModal } from "./type";

class ModalsState extends StoreModule {
  initState(): InitialStateModals {
    return {
      list: [],
      lastOpenModalId: 0,
    };
  }

  open(name: NameModal) {
    return new Promise((resolve) => {
      const id = codeGenerator(this.getState().lastOpenModalId)();
      this.setState(
        {
          ...this.getState(),
          list: [...this.getState().list, { name, id, resolve }],
          lastOpenModalId: id,
        },
        `Открытие модалки ${name}`
      );
    });
  }

  close(id: number, data?: string[] | string) {
    if (data) {
      const { resolve } = this.getState().list.find(item => item.id === id);
      resolve(data);
    }

    const list = this.getState().list.filter((item) => item.id !== id);

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
