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
    const modalsData = this.getState().data;
    const lastIndex = modalsData.findLastIndex((el) => el.name === name);
    const cb = modalsData[lastIndex]?.cb;

    if (cb) {
      if (data) cb(data);
      else cb();
    }

    this.setState(
      {
        ...this.getState(),
        data: modalsData.toSpliced(lastIndex, 1),
      },
      `Закрытие модалки ${name}`
    );
  }
}

export default ModalsState;
