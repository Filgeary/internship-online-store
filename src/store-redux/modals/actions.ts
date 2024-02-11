export default {
  /**
   * Открытие модалки по названию
   */
  open: (name: string, modalId: number, message: string = null) => {
    let resolveFunc;
    let rejectFunc;
    const promise = new Promise((resolve) => {
      resolveFunc = resolve;
      rejectFunc = resolve;
    });
    console.log({
      name,
      modalId,
      message,
      promise,
      resolve: resolveFunc,
      reject: rejectFunc,
    });
    return {
      type: "modal/open",
      payload: {
        name,
        modalId,
        message,
        promise,
        resolve: resolveFunc,
        reject: rejectFunc,
      },
    };
  },

  /**
   * Закрытие модалки
   */
  close: (modalId: number) => {
    console.log(modalId);
    return { type: "modal/close", payload: { modalId } };
  },
};
