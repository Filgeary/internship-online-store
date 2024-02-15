import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";

import type { TModalsNames } from "@src/types";

type InitialModalsState = {
  data: {
    name: TModalsNames;
    id: string | number;
    cb?: Function;
  }[];
};

class ModalsState extends StoreModule<InitialModalsState> {
  codeGenerator = codeGenerator();

  generateID() {
    return this.codeGenerator();
  }

  initState(): InitialModalsState {
    return {
      data: [],
    };
  }

  open(name: TModalsNames, cb?: Function) {
    const id = this.generateID();

    this.setState(
      {
        ...this.getState(),
        data: [...this.getState().data, { name, cb, id }],
      },
      `Открытие модалки ${name} с ID ${id}`
    );
  }

  close(modalID: string | number, dataParams?: any) {
    const { name, cb } = this.getState().data.find(({ id }) => id === modalID) || {};

    if (cb) {
      if (dataParams) cb(dataParams);
      else cb();
    }

    this.setState(
      {
        ...this.getState(),
        data: this.getState().data.filter(({ id }) => id !== modalID),
      },
      `Закрытие модалки ${name} с ID ${modalID}`
    );
  }
}

export default ModalsState;
