import StoreModule from '../module';
import generateHash from '@src/utils/generate-hash';

import { TModalsState } from './types';

class ModalsState extends StoreModule<'modals'> {
  initState(): TModalsState {
    return {
      mapOfOpened: {}, // Для быстрого поиска
      lastOpened: null, // Последняя открытая модалка (ID),
    };
  }

  /**
   * Открыть модалку
   * @param name {String}
   */
  open: (name: TModalsNames) => Promise<unknown> = (name: string) => {
    if (this.config.onlyUnique && this.getState().mapOfOpened[name]) return;
    const id = generateHash();
    // const id = self.crypto.randomUUID();

    const promise = new Promise((resolve, reject) => {
      this.setState({
        ...this.getState(),
        mapOfOpened: {
          ...this.getState().mapOfOpened,
          [id]: {
            name,
            resolve,
            reject,
          },
        },
        lastOpened: id,
      });
    });

    return promise;
  };

  /**
   * Закрыть модалку (успех)
   * @param data
   */
  close(data?: any) {
    const lastModalId = Object.keys(this.getState().mapOfOpened).at(-1);
    const { resolve: lastEvent } = this.getState().mapOfOpened[lastModalId];

    lastEvent(data);

    const mapOfOpened = { ...this.getState().mapOfOpened };
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
  closeRej(data?: any) {
    const lastModalId = Object.keys(this.getState().mapOfOpened).at(-1);
    const { reject: lastEvent } = this.getState().mapOfOpened[lastModalId];

    lastEvent(data);

    const mapOfOpened = { ...this.getState().mapOfOpened };
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
  closeByName(name: string, data: any, isSuccess = true, fromEnd = true) {
    const newMapOfOpened = { ...this.getState().mapOfOpened };
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
    }

    this.setState({
      ...this.getState(),
      mapOfOpened: newMapOfOpened,
    });
  }

  /**
   * Закрыть модалку по её id
   * @param id {String|Number} ID модалки
   * @param data {*} Данные, которые отловим в методах промиса
   * @param isSuccess {Boolean} Resolve / Reject при закрытии
   */
  closeById(id: string | number, data?: any, isSuccess = true) {
    const isModalExist = this.getState().mapOfOpened[id];
    if (!isModalExist) return;

    const newMapOfOpened = { ...this.getState().mapOfOpened };
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
