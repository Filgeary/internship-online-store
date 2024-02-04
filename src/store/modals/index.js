import listToTree from "@src/utils/list-to-tree";
import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";

const generateCode = codeGenerator(0);

class ModalsState extends StoreModule {
  initState() {
    return {
      mapOfOpened: {}, // Для быстрого поиска
      activeModals: [], // Стек открытых окон.
      lastOpened: null, // Последняя открытая модалка (ID),
    }
  }

  /**
   * Открыть модалку
   * @param name {String} 
   */
  open(name){
    if (this.config.onlyUnique && this.getState().mapOfOpened[name]) return;
    const id = generateCode();

    const countOpened = this.getState().mapOfOpened[name] ?? 0;

    const promise = new Promise((resolve, reject) => {
      this.setState({
        ...this.getState(),
        activeModals: [
          ...this.getState().activeModals,
          { name, id, resolve, reject },
        ],
        lastOpened: id,
        mapOfOpened: {...this.getState().mapOfOpened, [name]: countOpened + 1, [id]: true},
      });
    });

    return promise;
  }

  /**
   * Закрыть модалку (успех)
   * @param data 
   */
  close(data){
    const { resolve: lastEvent, name, id } = this.getState().activeModals.at(-1);
    lastEvent(data);
    
    const activeModals = this.getState().activeModals.slice(0, -1);
    const mapOfOpened = {...this.getState().mapOfOpened};
    mapOfOpened[name]--;
    delete mapOfOpened[id];

    this.setState({
      activeModals,
      mapOfOpened,
    });
  }

  /**
   * Закрыть модалку (ошибка)
   * @param data 
   */
  closeRej(data){
    const { reject: lastEvent, name, id } = this.getState().activeModals.at(-1);
    lastEvent(data);
    
    const activeModals = this.getState().activeModals.slice(0, -1);
    const mapOfOpened = {...this.getState().mapOfOpened};
    mapOfOpened[name]--;
    delete mapOfOpened[id];

    this.setState({
      activeModals,
      mapOfOpened,
    });
  }

  /**
   * Закрыть модалку по её имени
   * @param name {String} Имя модалки
   * @param data {*} Данные, которые отловим в методах промиса
   * @param isSuccess {Boolean} Resolve / Reject при закрытии
   */
  closeByName(name, data, isSuccess = true) {
    const isModalExist = this.getState().mapOfOpened[name];
    if (!isModalExist) return;
    
    const { resolve, reject, id } = this.getState().activeModals.findLast((modal) => modal.name === name);

    if (isSuccess) resolve(data);
    else reject(data);

    const indexLastActive = this.getState().activeModals.findLastIndex((modal) => modal.name === name);
    const activeModals = this.getState().activeModals.toSpliced(indexLastActive, 1);
    const mapOfOpened = {...this.getState().mapOfOpened};
    mapOfOpened[name]--;
    delete mapOfOpened[id];

    this.setState({
      ...this.getState(),
      activeModals,
      mapOfOpened,
    });
  }

  /**
   * Закрыть модалку по её id
   * @param id {String} ID модалки
   * @param data {*} Данные, которые отловим в методах промиса
   * @param isSuccess {Boolean} Resolve / Reject при закрытии
   */
  closeById(id, data, isSuccess = true) {
    const isModalExist = this.getState().mapOfOpened[id];
    if (!isModalExist) return;
    
    const { resolve, reject, name } = this.getState().activeModals.find((modal) => modal.id === id);

    if (isSuccess) resolve(data);
    else reject(data);

    const activeModals = this.getState().activeModals.filter((modal) => modal.id !== id);
    const mapOfOpened = {...this.getState().mapOfOpened};
    mapOfOpened[name]--;
    delete mapOfOpened[id];

    this.setState({
      ...this.getState(),
      activeModals,
      mapOfOpened,
    });
  }
}

export default ModalsState;
