import StoreModule from "../module";

class ModalsState extends StoreModule {
  initState() {
    return {
      activeModals: [], // Стек открытых окон. Именно Стек
      events: [], // Стек событий, которые должны произойти
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
    });

    const promise = new Promise((resolve, reject) => {
      this.setState({
        ...this.getState(),
        events: [...this.getState().events, {resolve, reject, name}],
      });
    });

    console.log(`Открываю модалку ${name}`);

    return promise;
  }

  /**
   * Закрыть модалку (успех)
   * @param data 
   */
  close(data){
    console.log('Щас буду закрывать');
    console.log(this.getState().events);
    const { resolve: lastEvent, name } = this.getState().events.at(-1);
    console.log(`Закрываю модалку ${name}`);
    lastEvent(data);
    
    this.setState({
      ...this.getState(),
      activeModals: this.getState().activeModals.slice(0, -1),
      events: this.getState().events.slice(0, -1),
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
    });
  }
}

export default ModalsState;
