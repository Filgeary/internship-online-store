import simplifyErrors from "@src/utils/simplify-errors";
import StoreModule from "../module";

import type { IUserSession } from "@src/types/IUserSession";

type InitialState = {
  user: IUserSession
  token: string | null
  errors: any
  waiting: boolean
  exists: boolean
}

/**
 * Сессия
 */
class SessionState extends StoreModule<'session'> {
  initState(): InitialState {
    return {
      user: {} as IUserSession,
      token: null,
      errors: null,
      waiting: true,
      exists: false
    };
  }

  async signIn(data: any, onSuccess: () => void) {
    this.setState(this.initState(), 'Авторизация');
    try {
      const res = await this.services.api.request({
        url: '/api/v1/users/sign',
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (!res.data.error) {
        this.setState({
          ...this.getState(),
          token: res.data.result.token,
          user: res.data.result.user,
          exists: true,
          waiting: false
        }, 'Успешная авторизация');

        // Запоминаем токен, чтобы потом автоматически аутентифицировать юзера
        window.localStorage.setItem('token', res.data.result.token);

        // Устанавливаем токен в АПИ
        this.services.api.setHeader(this.config.tokenHeader, res.data.result.token);

        if (onSuccess) onSuccess();
      } else {
        this.setState({
          ...this.getState(),
          errors: simplifyErrors(res.data.error.data.issues),
          waiting: false
        }, 'Ошибка авторизации');
      }

    } catch (e) {
      console.error(e);
    }
  }

  async signOut() {
    try {
      await this.services.api.request({
        url: '/api/v1/users/sign',
        method: 'DELETE'
      });
      // Удаляем токен
      window.localStorage.removeItem('token');
      // Удаляем заголовок
      this.services.api.setHeader(this.config.tokenHeader, null);
    } catch (error) {
      console.error(error);
    }
    this.setState({ ...this.initState(), waiting: false });
  }

  /**
   * По токену восстановление сессии
   */
  async remind() {
    const token = localStorage.getItem('token');
    if (token) {
      // Устанавливаем токен в АПИ
      this.services.api.setHeader(this.config.tokenHeader, token);
      // Проверяем токен выбором своего профиля
      const res = await this.services.api.request({ url: '/api/v1/users/self' });

      if (res.data.error) {
        // Удаляем плохой токен
        window.localStorage.removeItem('token');
        this.services.api.setHeader(this.config.tokenHeader, null);
        this.setState({
          ...this.getState(), exists: false, waiting: false
        }, 'Сессии нет');
      } else {
        this.setState({
          ...this.getState(), token: token, user: res.data.result, exists: true, waiting: false
        }, 'Успешно вспомнили сессию');
      }
    } else {
      // Если токена не было, то сбрасываем ожидание (так как по умолчанию true)
      this.setState({
        ...this.getState(), exists: false, waiting: false
      }, 'Сессии нет');
    }
  }

  resetErrors() {
    this.setState({ ...this.initState(), errors: null })
  }
}

export default SessionState;
