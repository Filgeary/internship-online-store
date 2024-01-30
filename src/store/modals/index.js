import StoreModule from "../module";

class ModalsState extends StoreModule {
  initState() {
    return {
      activeModals: [], // Стек открытых окон. Именно Стек
      events: [], // Стек событий, которые должны произойти
      dataObj: {},
    }
  }

  /**
   * Открыть модалку
   * @param name {String} 
   */
  open(name){
    this.setState({
      ...this.getState(),
      activeModals: [
        ...this.getState().activeModals,
        name,
      ],
      dataObj: {},
    });

    const promise = new Promise((resolve, reject) => {
      this.setState({
        ...this.getState(),
        events: [...this.getState().events, {resolve, reject}],
      });
    });

    return promise;
  }

  /**
   * Закрыть модалку (успех)
   * @param data 
   */
  close(data){
    const { resolve: lastEvent } = this.getState().events.at(-1);
    lastEvent(data);
    
    this.setState({
      ...this.getState(),
      activeModals: this.getState().activeModals.slice(0, -1),
      events: this.getState().events.slice(0, -1),
      dataObj: data,
    });
  }

  /**
   * Закрыть модалку (ошибка)
   * @param data 
   */
  closeRej(data){
    const { reject: lastEvent } = this.getState().events.at(-1);
    lastEvent(data);
    
    this.setState({
      ...this.getState(),
      activeModals: this.getState().activeModals.slice(0, -1),
      events: this.getState().events.slice(0, -1),
      dataObj: data,
    });
  }

  /**
   * Сбросить dataObj
   */
  resetDataObj() {
    this.setState({
      ...this.getState(),
      dataObj: {},
    });
  }
}

export default ModalsState;
