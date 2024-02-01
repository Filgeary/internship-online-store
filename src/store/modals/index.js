import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";
import * as modals from "@src/app/export-modals";

class ModalsState extends StoreModule {
  _codeGenerator = codeGenerator();

  initState() {
    return {
      list: [],
    };
  }

  open(name) {
    if (!(name in modals)) {
      console.log(`%cModal "${name}" not found to open!`, `color: ${'#d77332'}`);
      throw `Modal "${name}" not found to open!`;
    }
    return new Promise((resolve) => {
      this.setState({
        list: [
            ...this.getState().list,
            {
              name,
              id: "modal" + this._codeGenerator(),
              resolve,
            },
          ],
        },
        `Открытие модалки ${name}`
      );
    });
  }

  close(modalId, result) {
    const newModalList = this.getState().list.filter((modal) => {
      if (modal.id !== modalId) return true;
      modal.resolve(result);
      return false;
    });

    this.setState({
      list: newModalList
    }, `Закрытие модалки`);
  }
}

export default ModalsState;
