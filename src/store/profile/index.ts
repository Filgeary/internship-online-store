import StoreModule from "../module";

import type { IUserProfile } from "@src/types/IUserProfile";

type InitialProfileState = {
  data: IUserProfile | {};
  waiting: boolean;
}

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<InitialProfileState> {
  initState(): InitialProfileState {
    return {
      data: {} as IUserProfile,
      waiting: false
    }
  }

  /**
   * Загрузка профиля
   */
  async load() {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.setState({
      data: {},
      waiting: true
    });

    const { data } = await this.services.api.request({ url: `/api/v1/users/self` });

    // Профиль загружен успешно
    this.setState({
      data: data.result,
      waiting: false
    }, 'Загружен профиль из АПИ');
  }
}

export default ProfileState;
