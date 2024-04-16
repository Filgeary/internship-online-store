import React, { memo, useCallback } from "react";
import useStore from "@src/hooks/use-store";
import AdminLayout from "@src/components/admin";
import useTranslate from "@src/hooks/use-translate";
import menu from "@src/utils/menu";
import useSelector from "@src/hooks/use-selector";
import categories from "@src/utils/sidebar_categories";
import { StoreState } from "@src/store/types";
import useInit from "@src/hooks/use-init";
import * as Icons from "@ant-design/icons";
import { MenuInfo } from "rc-menu/lib/interface";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import generateUniqueId from "@src/utils/unicque_id";
import { useNavigate } from "react-router-dom";

const { AppstoreOutlined, FilterOutlined, GlobalOutlined } = Icons;

const Admin = memo(() => {
  const { t, setLang } = useTranslate();
  const store = useStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const select = useSelector((state: StoreState) => ({
    categories: state.categories.list,
    exists: state.session.exists,
  }));

  useInit(
    async () => {
      await Promise.all([
        store.actions.catalog.initParams(),
        store.actions.categories.load(),
        store.actions.countries.load(),
      ]);
    },
    [],
    true
  );

  const callbacks = {
    // Клик на пункт меню в Header
    onClickMenuTop: useCallback(
      (event: MenuInfo) => {
        const e = event as unknown as {domEvent: { target: { innerText: any } }}
        const nameMenu = e.domEvent.target.innerText
        if (nameMenu === "Главная" || nameMenu === "Main") navigate("/", { state: { back: location.pathname } })
        if (nameMenu === "Чат" || nameMenu === "Chat") navigate("/chat", { state: { back: location.pathname } })
        if (nameMenu === "Профиль" || nameMenu === "Profile") navigate("/profile", { state: { back: location.pathname } })
        if (nameMenu === "Графический редактор" || nameMenu === "Graphics editor") navigate("/drawing", { state: { back: location.pathname } })
        if (nameMenu === "Вход" || nameMenu === "Sign In") navigate("/login", { state: { back: location.pathname } })
        if (nameMenu === "Выход" || nameMenu === "Sign Out") store.actions.session.signOut()
        if (nameMenu === "Корзина" || nameMenu === "Cart") {
          dispatch(modalsActions.open({ name: "basket", id: generateUniqueId() }))
          dispatch(modalsActions.changeActiveModal(true))
        }
      },
      [store]
    ),
    // Клик на пункт меню в sidebar
    onClickMenuSidebar: useCallback(
      (event: MenuInfo) => {
        const e = event as unknown as {domEvent: { target: { innerText: any } }}
        const nameMenu = e.domEvent.target.innerText
        nameMenu === "Русский" || (nameMenu === "Russian" && setLang("ru"))
        nameMenu === "English" && setLang("en")
      },
      [store]
    ),
  };

  const menuTop = menu([
    { label: t("menu.main") },
    { label: t("menu.chat") },
    { label: t("menu.profile") },
    { label: t("menu.editor") },
    { label: t("basket.title") },
    { label: select.exists ? t("session.signOut") : t("session.signIn") },
  ]);

  const sidebarCategories = menu([
    ...categories(select.categories, <AppstoreOutlined />),
    { label: "Фильтры", icon: <FilterOutlined /> },
    { label: "Страны", icon: <GlobalOutlined /> },
    {
      label: t("menu.settings"),
      icon: <Icons.SettingOutlined />,
      children: [
        {
          label: "Перевод",
          children: [{ label: t("menu.ru") }, { label: t("menu.en") }],
        },
        { label: "Тема" },
      ],
    },
  ])

  return (
    <AdminLayout
      menu={menuTop}
      sidebarCategories={sidebarCategories}
      onClickMenuTop={callbacks.onClickMenuTop}
      onClickMenuSidebar={callbacks.onClickMenuSidebar}
    />
  );
});

export default Admin;
