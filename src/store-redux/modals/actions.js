export default {
  /**
   * Открытие модалки по названию
   * @param name
   */
  open: (name, message = null) => {
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
  close: (name) => {
    return { type: "modal/close", payload: { name } };
  },
};
