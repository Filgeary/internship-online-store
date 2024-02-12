import { memo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useSelector from "@src/hooks/use-selector";

type Props = {
  redirect: string
  children: React.ReactNode
}

function Protected({ children, redirect }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const select = useSelector(state => ({
    exists: state.session.exists,
    waiting: state.session.waiting
  }));

  useEffect(() => {
    if (!select.exists && !select.waiting) {
      navigate(redirect, { state: { back: location.pathname } });
    }
  }, [select.exists, select.waiting]);

  if (!select.exists || select.waiting) {
    return <div>Ждём...</div>
  } else {
    return children;
  }
}

export default memo(Protected);
