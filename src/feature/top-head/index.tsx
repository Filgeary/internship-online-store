import React, {memo, useCallback} from "react";
import useTranslate from "@src/shared/hooks/use-translate";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useSelector from "@src/shared/hooks/use-selector";
import useStore from "@src/shared/hooks/use-store";
import SideLayout from "@src/shared/ui/layout/side-layout";
function TopHead() {

  const {t} = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();

  const select = useSelector(state => ({
    user: state.session.user,
    exists: state.session.exists
  }));

  const callbacks = {
    // Переход к авторизации
    onSignIn: useCallback(() => {
      navigate('/login', {state: {back: location.pathname}});
    }, [location.pathname]),

    // Отмена авторизации
    onSignOut: useCallback(() => {
      store.actions.session.signOut();
    }, []),
  }

  return (
    <SideLayout side="end" padding="small">
      {select.exists ? <Link to="/profile">{select.user.profile.name}</Link> : ''}
      {select.exists
        ? <button onClick={callbacks.onSignOut}>{t('session.signOut')}</button>
        : <button onClick={callbacks.onSignIn}>{t('session.signIn')}</button>
      }
    </SideLayout>
  );
}


export default memo(TopHead);
