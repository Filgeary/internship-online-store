import StoreModule from "../module";

class ModalsState extends StoreModule {
  initState() {
    return {
      mapOfNames: {}, // Для быстрого поиска
      activeModals: [], // Стек открытых окон.
    }
  }

  /**
   * Открыть модалку
   * @param name {String} 
   */
  open(name){
    if (this.config.onlyUnique && this.getState().mapOfNames[name]) return;

    const promise = new Promise((resolve, reject) => {
      this.setState({
        ...this.getState(),
        activeModals: [
          ...this.getState().activeModals,
          { name, resolve, reject },
        ],
        mapOfNames: {...this.getState().mapOfNames, [name]: true},
      });
    });

    return promise;
  }

  /**
   * Закрыть модалку (успех)
   * @param data 
   */
  close(data){
    const { resolve: lastEvent, name } = this.getState().activeModals.at(-1);
    lastEvent(data);
    
    const activeModals = this.getState().activeModals.slice(0, -1);
    const mapOfNames = {...this.getState().mapOfNames};
    delete mapOfNames[name];

    this.setState({
      activeModals,
      mapOfNames,
    });
  }

  /**
   * Закрыть модалку (ошибка)
   * @param data 
   */
  closeRej(data){
    const { reject: lastEvent, name } = this.getState().activeModals.at(-1);
    lastEvent(data);
    
    const activeModals = this.getState().activeModals.slice(0, -1);
    const mapOfNames = {...this.getState().mapOfNames};
    delete mapOfNames[name];

    this.setState({
      activeModals,
      mapOfNames,
    });
  }

  /**
   * Закрыть модалку по её имени
   * @param name {String} Имя модалки
   * @param data {*} Данные, которые отловим в методах промиса
   * @param isSuccess {Boolean} Resolve / Reject при закрытии
   */
  closeByName(name, data, isSuccess = true) {
    const isModalExist = this.getState().mapOfNames[name];
    if (!isModalExist) return;
    
    const { resolve, reject } = this.getState().activeModals.find((modal) => modal.name === name);

    if (isSuccess) resolve(data);
    else reject(data);

    const activeModals = this.getState().activeModals.filter((modal) => modal.name !== name);
    const mapOfNames = {...this.getState().mapOfNames};
    delete mapOfNames[name]; 

    this.setState({
      activeModals,
      mapOfNames,
    });
  }
}

export default ModalsState;
