import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";
import type { InitialStateModals, ModalsName } from "./type";

class ModalsState extends StoreModule<InitialStateModals> {
  initState(): InitialStateModals {
    return {
      list: [],
      lastOpenModalId: 0,
    };
  }

  open(name: ModalsName) {
    return new Promise((resolve) => {
      const id: number = codeGenerator(this.getState().lastOpenModalId)();
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

  close(id: number, data?: string[] | string | number) {
    if (data) {
      const modal = this.getState().list.find((item) => item.id === id);
      modal?.resolve(data);
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
