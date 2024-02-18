import StoreModule from "../module";
import { IProfileState, User } from "./types";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<IProfileState> {
  initState(): IProfileState {
    return {
      data: {} as User,
      waiting: false, // признак ожидания загрузки
    };
  }

  /**
   * Загрузка профиля
   */
  async load() {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.setState({
      data: {} as User,
      waiting: true,
    });

    const { data } = await this.services.api.request({
      url: `/api/v1/users/self`,
    });

    // Профиль загружен успешно
    this.setState(
      {
        data: data.result as User,
        waiting: false,
      },
      "Загружен профиль из АПИ"
    );
  }
}

export default ProfileState;
