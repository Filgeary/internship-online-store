import {memo, useEffect} from "react";
import useSelector from "@src/hooks/use-selector";
import {useLocation, useNavigate} from "react-router-dom";
import { ProtectedProps } from "./type";

function Protected({children, redirect}: ProtectedProps) {

  const select = useSelector((state: any) => ({
    exists: state.session.exists,
    waiting: state.session.waiting
  }));

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!select.exists && !select.waiting) {
      navigate(redirect, {state: { back: location.pathname }});
    }
  }, [select.exists, select.waiting]);

  if (!select.exists || select.waiting){
    return <div>Ждём...</div>
  } else {
    return children;
  }
}

export default memo(Protected);
