import StoreModule from "../module";

/**
 * Детальная информация о пользователе
 */
class ProfileState extends StoreModule {

  initState() {
    return {
      data: {},
      waiting: false // признак ожидания загрузки
    }
  }

  /**
   * Загрузка профиля
   * @return {Promise<void>}
   */
  async load() {
    // Сброс текущего профиля и установка признака ожидания загрузки
    this.setState({
      data: {},
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
