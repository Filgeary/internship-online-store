import StoreModule from "../module";
import { ProfileStateType, UserAccountType } from "./types";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<ProfileStateType> {

  waiting: boolean;
  data: UserAccountType | null;

  initState(): ProfileStateType {
    return {
      data: null,
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
      data: null,
      waiting: true
    });

    const {data} = await this.services.api.request({url: `/api/v1/users/self`});

    // Профиль загружен успешно
    this.setState({
      data: data.result,
      waiting: false
    }, 'Загружен профиль из АПИ');
  }
}

export default ProfileState;
