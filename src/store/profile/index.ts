import StoreModule from "../module";
import type { InitialStateProfile, ResponseProfile } from "./type";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule {

  initState(): InitialStateProfile {
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

    const res = await this.services.api.request<ResponseProfile>({url: `/api/v1/users/self`});

    if(res.status === 200) {
      // Профиль загружен успешно
      this.setState({
        data: res.data.result,
        waiting: false
      }, 'Загружен профиль из АПИ');
    }
  }
}

export default ProfileState;
