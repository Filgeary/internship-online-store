import StoreModule from "../module";

export type TModals = {
  name: string | null;
};
class ModalsState extends StoreModule {
  initState(): TModals {
    return {
      name: null,
    };
  }

  open(name) {
    this.setState({ name }, `Открытие модалки ${name}`);
  }

  close() {
    this.setState({ name: null }, `Закрытие модалки`);
  }
}

export default ModalsState;
