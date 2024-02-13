import { TConfigModules } from '@src/config';
import StoreModule from '../module';
import { TProfileState } from './types';

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule<
  TProfileState,
  TConfigModules['profile']
> {
  initState(): TProfileState {
    return {
      data: {},
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
      data: {},
      waiting: true,
    });

    const { data } = await this.services.api.request<TProfile>({
      url: `/api/v1/users/self`,
    });

    // Профиль загружен успешно
    this.setState(
      {
        data: data.result,
        waiting: false,
      },
      'Загружен профиль из АПИ'
    );
  }
}

export default ProfileState;
