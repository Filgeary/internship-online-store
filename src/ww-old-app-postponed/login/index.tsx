import React, {memo, useCallback, useState} from "react";
import useTranslate from "../../ww-old-hooks-postponed/use-translate";
import Head from "@src/ww-old-components-postponed/head";
import LocaleSelect from "@src/ww-old-containers/locale-select";
import Navigation from "@src/ww-old-containers/navigation";
import PageLayout from "@src/ww-old-components-postponed/page-layout";
import Input from "@src/ww-old-components-postponed/input";
import Field from "@src/ww-old-components-postponed/field";
import SideLayout from "@src/ww-old-components-postponed/side-layout";
import TopHead from "@src/ww-old-containers/top-head";
import {useLocation, useNavigate} from "react-router-dom";
import useStore from "../../ww-old-hooks-postponed/use-store";
import useSelector from "../../ww-old-hooks-postponed/use-selector";
import useInit from "../../ww-old-hooks-postponed/use-init";


function Login() {

  const {t} = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();

  useInit(() => {
    store.actions.session.resetErrors();
  })

  const select = useSelector(state => ({
    waiting: state.session.waiting,
    errors: state.session.errors
  }));

  const [data, setData] = useState({
    login: '',
    password: ''
  });
  type nameData = keyof typeof data

  const callbacks = {
    // Колбэк на ввод в элементах формы
    onChange: useCallback((value: string, name: nameData) => {
      setData(prevData => ({...prevData, [name]: value}));
    }, []),

    // Отправка данных формы для авторизации
    onSubmit: useCallback((e:  React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      store.actions.session.signIn(data, () => {
        // Возврат на страницу, с которой пришли
        const back = location.state?.back && location.state?.back !== location.pathname
          ? location.state?.back
          : '/';
        navigate(back);
      });

    }, [data, location.state])
  };

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title.main')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <SideLayout padding='medium'>
        <form onSubmit={callbacks.onSubmit}>
          <h2>{t('auth.title')}</h2>
          <Field label={t('auth.login')} error={select.errors?.login}>
            <Input<'login'> name="login" value={data.login} onChange={callbacks.onChange}/>
          </Field>
          <Field label={t('auth.password')} error={select.errors?.password}>
            <Input<'password'> name="password" type="password" value={data.password}
                   onChange={callbacks.onChange}/>
          </Field>
          <Field error={select.errors?.other}>
            <button type="submit">{t('auth.signIn')}</button>
          </Field>
        </form>
      </SideLayout>
    </PageLayout>
  );
}

export default memo(Login);
