class APIService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
    this.services = services;
    this.config = config;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param timeout
   * @param onErr
   * @param options
   * @returns {Promise<{}>}
   */
  async request({url, method = 'GET', headers = {}, timeout = null, onErr = () => {}, ...options}) {
    if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;

    let timerOfErr = null;
    if (Number.isFinite(timeout)) {
      const abortController = new AbortController();
      options.signal = abortController.signal;

      timerOfErr = setTimeout(() => {
        abortController.abort();
      }, timeout);
    }

    let res = null;

    try {
      res = await fetch(url, {
        method,
        headers: {...this.defaultHeaders, ...headers},
        ...options,
      });
      clearTimeout(timerOfErr);

      return {data: await res.json(), status: res.status, headers: res.headers};
    } catch (err) {
      throw new Error('Ошибка на сервере, попробуйте позже...');
    }
  }

  /**
   * Установка или сброс заголовка
   * @param name {String} Название заголовка
   * @param value {String|null} Значение заголовка
   */
  setHeader(name, value = null) {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}

export default APIService;
