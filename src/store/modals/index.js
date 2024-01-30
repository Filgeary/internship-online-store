import StoreModule from "../module";

class ModalsState extends StoreModule {
  initState() {
    return {
      data: [],
    };
  }

  open(name, cb) {
    this.setState(
      {
        ...this.getState(),
        data: [...this.getState().data, { name, cb }],
      },
      `Открытие модалки ${name}`
    );
  }

  close(name, data) {
    const { cb } = this.getState().data.find((item) => item.name === name);
    if (cb) {
      if (data) cb(data);
      else cb();
    }

    this.setState(
      {
        ...this.getState(),
        data: this.getState().data.filter((item) => item.name !== name),
      },
      `Закрытие модалки ${name}`
    );
  }
}

export default ModalsState;
