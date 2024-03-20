import React, {memo, useEffect} from "react";
import useSelector from "@src/shared/hooks/use-selector";
import {useLocation, useNavigate} from "react-router-dom";

interface Props {
  children: React.ReactNode,
  redirect: string
}

function Protected({children, redirect}: Props): React.ReactNode {

  const select = useSelector(state => ({
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
