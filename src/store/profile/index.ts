import StoreModule from "../module";
import type { ProfileDataResponse, ProfileState } from "./types";

/**
 * Детальная информация о пользователе
 */
class ProfileModule extends StoreModule<'profile'> {
  initState(): ProfileState {
    return {
      data: {},
      waiting: false // признак ожидания загрузки
    }
  }

  /**
   * Загрузка профиля
   * @return {Promise<void>}
   */
  async load(): Promise<void> {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.setState({
      data: {},
      waiting: true
    });

    const {data} = await this.services.api.request<ProfileDataResponse>({url: `/api/v1/users/self`});

    // Профиль загружен успешно
    this.setState({
      data: data.result,
      waiting: false
    }, 'Загружен профиль из АПИ');
  }
}

export default ProfileModule;
