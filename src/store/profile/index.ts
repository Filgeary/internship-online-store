import StoreModule from "../module";
import { IProfile, IProfileState } from "./types";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<IProfileState> {
  initState(): IProfileState {
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

    const {data} = await this.services.api.request<IProfile>({url: `/api/v1/users/self`});

    // Профиль загружен успешно
    this.setState({
      data: data.result,
      waiting: false
    }, 'Загружен профиль из АПИ');
  }
}

export default ProfileState;
