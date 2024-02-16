import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import { TUser } from "@src/store/profile/types";


function ProfileCard ({ data = {} as TUser}) {
  const cn = bem("ProfileCard");

  return (
    <div className={cn()}>
      <h3 className={cn("title")}>Профиль</h3>
      <div className={cn("prop")}>
        <div className={cn("label")}>Имя:</div>
        <div className={cn("value")}>{data?.profile?.name}</div>
      </div>
      <div className={cn("prop")}>
        <div className={cn("label")}>Телефон:</div>
        <div className={cn("value")}>{data?.profile?.phone}</div>
      </div>
      <div className={cn("prop")}>
        <div className={cn("label")}>email:</div>
        <div className={cn("value")}>{data?.email}</div>
      </div>
    </div>
  );
};

/* ProfileCard.defaultProps = {
} */

export default memo(ProfileCard);
