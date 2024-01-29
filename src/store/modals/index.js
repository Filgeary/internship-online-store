import StoreModule from "../module";

class ModalsState extends StoreModule {
  initState() {
    return {
      activeModals: [], // Стек открытых окон. Именно Стек
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
  }

  /**
   * Закрыть модалку
   * @param dataObj 
   */
  close(data){
    this.setState({
      ...this.getState(),
      activeModals: this.getState().activeModals.slice(0, -1),
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
