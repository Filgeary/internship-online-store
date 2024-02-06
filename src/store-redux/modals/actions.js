export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name, id, message = null) => {
    let resolveFunc;
    let rejectFunc;
    const promise = new Promise((resolve) => {
      resolveFunc = resolve;
      rejectFunc = resolve;
    });
    return {
      type: "modal/open",
      payload: {
        name,
        id,
        message,
        promise,
        resolve: resolveFunc,
        reject: rejectFunc,
      },
    };
  },

  /**
   * Закрытие модалки
   * @param name
   */
  close: (id) => {
    return { type: "modal/close", payload: { id } };
  },
};
