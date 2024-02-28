import { memo, FC } from "react";
import { cn as bem } from "@bem-react/classname";
import Input from "@src/components/input";
import "./style.css";

interface IChatLayout {
  onMessage: (text: string) => void;
}

const ChatLayout: FC<IChatLayout> = (onMessage) => {
  const cn = bem("Chat");
  return (
    <div className={cn()}>
      <div className={cn("wrap-message")}>
        <div className={cn("message")}>
          Сообщение r ttttttt yyyyyyyyyy uuuuuuuuu uiii iiiiiiiiii
        </div>
      </div>
      <div className={cn("wrap-message")}>
        <div className={cn("message")}>
          Сообщение r ttttttt yyyyyyyyyy uuuuuuuuu uiii iiiiiiiiii bbbbbb
          bbbbbbb b bbbbbbbbhtfghn ytrsy ytsery s yr5es5yea y5esyse5 y5esye5sy
          y5eyu y5es5yse5y y5e4ye54s y5e4sy 5e4s5y 5e4s5y5 y5e4sy 5es4y e54s5y
          5e45y e45y5euyhtrfhtjtrsthj yhrtshrtsjsr rtjh
        </div>
        <div className={cn("wrap-message", { right: true })}>
          <div className={cn("message")}>
            Сообщение r ttttttt yyyyyyyyyy uuuuuuuuu uiii iiiiiiiiii bbbbbb
            bbbbbbb b bbbbbbbbhtfghn ytrsy ytsery s yr5es5yea y5esyse5 y5esye5sy
            y5eyu y5es5yse5y y5e4ye54s y5e4sy 5e4s5y 5e4s5y5 y5e4sy 5es4y e54s5y
            5e45y e45y5euyhtrfhtjtrsthj yhrtshrtsjsr rtjh
          </div>
        </div>
      </div>
      <div className={cn("input")}>
        <Input
          name="message"
          value={""}
          onChange={() => {}}
          theme={"message"}
          placeholder="Написать сообщение..."
        />
        <div><button className={cn("button")}>Отправить</button></div>
      </div>
    </div>
  );
};

export default memo(ChatLayout);
