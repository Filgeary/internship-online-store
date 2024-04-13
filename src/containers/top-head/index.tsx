import {useCallback} from "react";
import SideLayout from "@src/components/side-layout";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useTranslate from "@src/hooks/use-translate";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import { Button } from "antd";

function TopHead() {

  const {t} = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();

  const select = useSelector((state) => ({
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
      store.actions.session?.signOut();
    }, []),
  }

  return (
    <SideLayout side="end" padding="small">
      {select.exists ? (
        <SideLayout>
          <Link to="/admin">Admin</Link>
          <Link to="/chat">{t('chat.title')}</Link>
          <Link to="/profile">{select.user.profile?.name}</Link>
        </SideLayout>
      ) : (
        ""
      )}
      {select.exists ? (
        <Button onClick={callbacks.onSignOut}>{t("session.signOut")}</Button>
      ) : (
        <Button onClick={callbacks.onSignIn}>{t("session.signIn")}</Button>
      )}
    </SideLayout>
  );
}


export default TopHead;
