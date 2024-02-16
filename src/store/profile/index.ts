import StoreModule from "../module";
import { TApiResponseUser, TProfileState, TUser } from "./types";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<TProfileState> {
  initState(): TProfileState {
    return {
      data: {} as TUser,
      waiting: false, // признак ожидания загрузки
    };
  }

  /**
   * Загрузка профиля
   * @return {Promise<void>}
   */
  async load(): Promise<void> {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.setState({
      data: {} as TUser,
      waiting: true,
    });

    const { data }: TApiResponseUser = await this.services.api.request({
      url: `/api/v1/users/self`,
    });

    // Профиль загружен успешно
    this.setState(
      {
        data: data.result as TUser,
        waiting: false,
      },
      "Загружен профиль из АПИ"
    );
  }
}

export default ProfileState;
