export default {
  /**
   * Загрузка товара
   * @param id
   * @return {Function}
   */
  load: (id: string): Function => {
    
    return async (
      dispatch: (arg0: { type: string; payload?: { data: any } }) => void,
      getState: any,
      services: { api: { request: (arg0: { url: string }) => any } }
    ) => {
      // Сброс текущего товара и установка признака ожидания загрузки
      dispatch({ type: "article/load-start" });

      try {
        const res = await services.api.request({
          url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`,
        });
        // Товар загружен успешно
        dispatch({
          type: "article/load-success",
          payload: { data: res.data.result },
        });
      } catch (e) {
        //Ошибка загрузки
        dispatch({ type: "article/load-error" });
      }
    };
  },
};
