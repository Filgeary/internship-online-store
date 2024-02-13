import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";

type InitialState = {
  data: {
    name: string;
    cb: Function;
    id: string | number;
  }[];
};

class ModalsState extends StoreModule<'modals'> {
  codeGenerator = codeGenerator();

  generateID() {
    return this.codeGenerator();
  }

  initState(): InitialState {
    return {
      data: [],
    };
  }

  open(name: string, cb: Function) {
    const id = this.generateID();

    this.setState(
      {
        ...this.getState(),
        data: [...this.getState().data, { name, cb, id }],
      },
      `Открытие модалки ${name} с ID ${id}`
    );
  }

  close(modalID: string | number, data: any) {
    const { name, cb } = this.getState().data.find(({ id }) => id === modalID) || {};

    if (cb) {
      if (data) cb(data);
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
