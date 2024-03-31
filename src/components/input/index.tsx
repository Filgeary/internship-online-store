import {
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cn as bem } from "@bem-react/classname";
import debounce from "lodash.debounce";
import "./style.css";


type TInputProps = {
  value: any ;
  name?: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string, name?: string) => void;
  theme?: string;
  delay?: number;
};
function Input(props: TInputProps) {
  // Внутренний стейт для быстрого отображения ввода
  const [value, setValue] = useState(props.value);

  const onChangeDebounce = useCallback(
    debounce((value: string) => props.onChange(value, props.name), 600),
    [props.onChange, props.name]
  );

  // Обработчик изменений в поле
  const onChange = (event: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    setValue(event.target.value);
    onChangeDebounce(event.target.value);
  };

  // Обновление стейта, если передан новый value
  useEffect(() => setValue(props.value), [props.value]);

  const cn = bem("Input");
  return (
    <input
      className={cn({ theme: props.theme })}
      value={value}
      type={props.type}
      placeholder={props.placeholder}
      onChange={onChange}
    />
  );
}

 Input.defaultProps = {
  onChange: () => {},
  type: "text",
  theme: "",
};

export default memo(Input);
