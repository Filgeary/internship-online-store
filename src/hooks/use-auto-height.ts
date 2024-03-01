import { useEffect } from "react";

const useAutoSizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      // Сброс высоты для получения корректного скролла
      textAreaRef.style.height = "0px";
      //Уменьшение высоты на 20px, тк выдает слишком большое значение
      const scrollHeight = textAreaRef.scrollHeight - 20;

      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

export default useAutoSizeTextArea;
