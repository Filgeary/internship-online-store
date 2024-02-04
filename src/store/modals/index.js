import StoreModule from "../module";
import codeGenerator from "@src/utils/code-generator";
import generateHash from '@src/utils/generate-hash';

const generateCode = codeGenerator(0);

class ModalsState extends StoreModule {
  initState() {
    return {
      mapOfOpened: {}, // Для быстрого поиска
      // activeModals: [], // Стек открытых окон.
      lastOpened: null, // Последняя открытая модалка (ID),
    }
  }

  /**
   * Открыть модалку
   * @param name {String} 
   */
  open(name){
    if (this.config.onlyUnique && this.getState().mapOfOpened[name]) return;
    const id = generateHash();

    // const countOpened = this.getState().mapOfOpened[name] ?? 0;

    const promise = new Promise((resolve, reject) => {
      // this.setState({
      //   ...this.getState(),
      //   activeModals: [
      //     ...this.getState().activeModals,
      //     { name, id, resolve, reject },
      //   ], хранит все экземпляры модальных окон
      //   lastOpened: id,
      //   mapOfOpened: {...this.getState().mapOfOpened, [name]: countOpened + 1, [id]: true},
      //   хранит количество открытых окон (по имени), true/false для id
      // });

      this.setState({
        ...this.getState(),
        mapOfOpened: {
          ...this.getState().mapOfOpened,
          [id]: {
            name,
            resolve,
            reject,
          }
        },
        lastOpened: id,
      })
    });

    return promise;
  }

  /**
   * Закрыть модалку (успех)
   * @param data 
   */
  close(data){
    const lastModalId = Object.keys(this.getState().mapOfOpened).at(-1);
    const { resolve: lastEvent } = this.getState().mapOfOpened[lastModalId];

    lastEvent(data);
    
    const mapOfOpened = {...this.getState().mapOfOpened};
    delete mapOfOpened[lastModalId];

    this.setState({
      ...this.getState(),
      mapOfOpened,
    });
  }

  /**
   * Закрыть модалку (ошибка)
   * @param data 
   */
  closeRej(data){
    const lastModalId = Object.keys(this.getState().mapOfOpened).at(-1);
    const { reject: lastEvent } = this.getState().mapOfOpened[lastModalId];

    lastEvent(data);
    
    const mapOfOpened = {...this.getState().mapOfOpened};
    delete mapOfOpened[lastModalId];

    this.setState({
      ...this.getState(),
      mapOfOpened,
    });
  }

  /**
   * Закрыть модалку по её имени
   * @param name {String} Имя модалки
   * @param data {*} Данные, которые отловим в методах промиса
   * @param isSuccess {Boolean} Resolve / Reject при закрытии
   * @param fromEnd {Boolean} Начинать поиск с конца
   */
  closeByName(name, data, isSuccess = true, fromEnd = true) {
    // const { resolve, reject, id } = this.getState().activeModals.findLast((modal) => modal.name === name);

    // if (isSuccess) resolve(data);
    // else reject(data);

    // const indexLastActive = this.getState().activeModals.findLastIndex((modal) => modal.name === name);
    // const activeModals = this.getState().activeModals.toSpliced(indexLastActive, 1);
    // const mapOfOpened = {...this.getState().mapOfOpened};
    // mapOfOpened[name]--;
    // delete mapOfOpened[id];

    const newMapOfOpened = {...this.getState().mapOfOpened};
    const arrOfIds = Object.keys(this.getState().mapOfOpened);

    if (fromEnd) arrOfIds.reverse();

    for (const modalId of arrOfIds) {
      if (newMapOfOpened[modalId].name === name) {
        const { resolve, reject } = newMapOfOpened[modalId];

        if (isSuccess) resolve(data);
        else reject(data);
    
        delete newMapOfOpened[modalId];
        break;
      }
    };

    this.setState({
      ...this.getState(),
      mapOfOpened: newMapOfOpened,
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
    
    // const { resolve, reject, name } = this.getState().activeModals.find((modal) => modal.id === id);

    // if (isSuccess) resolve(data);
    // else reject(data);

    // const activeModals = this.getState().activeModals.filter((modal) => modal.id !== id);
    // const mapOfOpened = {...this.getState().mapOfOpened};
    // mapOfOpened[name]--;
    // delete mapOfOpened[id];

    // this.setState({
    //   ...this.getState(),
    //   activeModals,
    //   mapOfOpened,
    // });
    const newMapOfOpened = {...this.getState().mapOfOpened};
    const { resolve, reject } = newMapOfOpened[id];
    delete newMapOfOpened[id];

    if (isSuccess) resolve(data);
    else reject(data);

    this.setState({
      ...this.getState(),
      mapOfOpened: newMapOfOpened,
    });
  }
}

export default ModalsState;
