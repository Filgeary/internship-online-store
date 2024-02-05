import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";

class ModalsState extends StoreModule {
  codeGenerator = codeGenerator();

  generateID() {
    return this.codeGenerator();
  }

  initState() {
    return {
      data: [],
    };
  }

  open(name, cb) {
    const id = this.generateID();

    this.setState(
      {
        ...this.getState(),
        data: [...this.getState().data, { name, cb, id }],
      },
      `Открытие модалки ${name} с ID ${id}`
    );
  }

  close(modalID, data) {
    const { name, cb } = this.getState().data.find(({ id }) => id === modalID);

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
