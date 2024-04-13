import React, { useState, memo, useEffect, createContext, useContext, useMemo } from 'react';
import Lottie from 'react-lottie';
import logoAnimation from './assets/logo-animation.json';

import { Link, useLocation } from 'react-router-dom';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, message } from 'antd';

import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

import AdminTabs from './admin-tabs';
import AdminModals from './admin-modals';
import AdminCharts from './admin-charts';
import AdminBreadcrumbs from './admin-breadcrumbs';

import { TCatalogArticle, TCatalogEntities } from '@src/store/catalog/types';
import { TCity } from '@src/store/admin/types';
import AdminDrawers from './admin-drawers';

const { Sider, Content, Footer, Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to='/admin'>Общее</Link>, '1', <PieChartOutlined />),
  getItem(<Link to='/admin/charts'>Статистика</Link>, '2', <DesktopOutlined />),
  getItem('Администраторы', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Работники', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem(<Link to='/admin/notes'>Примечания</Link>, '9', <FileOutlined />),
];

const AdminContext = createContext(null);

export const useAdminContext = () => {
  const ctx = useContext(AdminContext);

  if (!ctx) {
    throw new Error('Компоненты админки должны быть обёрнуты в <Admin />');
  }

  return ctx;
};

type TProps = {
  children: React.ReactNode;
};

function Admin(props: TProps) {
  const { children } = props;
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const store = useStore();

  const select = useAppSelector((state) => ({
    articlesFetching: state.admin.articles.fetching,
    activeArticleId: state.admin.articles.active,
    activeArticleFetching: state.admin.articles.activeFetching,

    citiesFetching: state.admin.cities.fetching,
    activeCityId: state.admin.cities.active,
    activeCityFetching: state.admin.cities.activeFetching,

    categories: state.categories.list,
    countries: state.countries.list,

    catalogPage: state.catalog.params.page,
    catalogItems: state.catalog.list,
    catalogWaiting: state.catalog.waiting,
    limitByPage: state.catalog.params.limit,
    totalPagination: state.catalog.count,

    activeCatalogEntity: state.catalog.params.activeEntity,

    actionWithActiveArticle: state.admin.articles.actionWithActive,
    actionWithActiveCity: state.admin.cities.actionWithActive,
  }));

  const [activeArticle, setActiveArticle] = useState<TCatalogArticle>(null);
  const [activeCity, setActiveCity] = useState<TCity>(null);

  const [articleToAdd, setArticleToAdd] = useState<TCatalogArticle>(null);
  const [cityToAdd, setCityToAdd] = useState<TCity>(null);

  const helpers = {
    keyValueChanger: (
      setterFunction: React.Dispatch<React.SetStateAction<any>>,
      idIn: string[] = []
    ) => {
      return (key: string, val: any) => {
        if (idIn.includes(key)) {
          setterFunction((prev: any) => ({
            ...prev,
            [key]: {
              ...prev[key],
              _id: val,
            },
          }));
        } else {
          setterFunction((prev: any) => ({
            ...prev,
            [key]: val,
          }));
        }
      };
    },
  };

  const handlers = {
    onDeleteArticle: async (id: string) => {
      try {
        await store.actions.admin.removeArticle(id);
        message.success('Удалено успешно!');
      } catch (err) {
        message.error(err.message);
      }
    },
    onDeleteCity: async (id: string) => {
      try {
        await store.actions.admin.removeCity(id);
        message.success('Удалено успешно!');
      } catch (err) {
        message.error(err.message);
      }
    },
    onEditArticle: (id: string) => store.actions.admin.setActiveArticle(id, 'edit'),
    onEditCity: (id: string) => store.actions.admin.setActiveCity(id, 'edit'),

    onLookArticle: (id: string) => store.actions.admin.setActiveArticle(id, 'look'),

    onActiveArticleChange: helpers.keyValueChanger(setActiveArticle, ['category', 'madeIn']),
    onActiveCityChange: helpers.keyValueChanger(setActiveCity),
    onArticleToAddChange: helpers.keyValueChanger(setArticleToAdd, ['category', 'madeIn']),
    onCityToAddChange: helpers.keyValueChanger(setCityToAdd),

    onPaginationChange: (page: number, pageSize: number) => {
      console.log({ page, pageSize });
      store.actions.catalog.setParams({ page, limit: pageSize }, false);
    },
    onAddArticleBtnClick: () => {
      setArticleToAdd({
        title: '',
        price: 0,
        category: { _id: null },
        madeIn: { _id: null },
      } as TCatalogArticle);
    },
    onAddCityBtnClick: () => {
      setCityToAdd({ title: '', population: 0 } as TCity);
    },
    onTabKeyChange: (keyStr: TCatalogEntities) => {
      store.actions.catalog.setParams({ activeEntity: keyStr });
    },
  };

  const callbacks = {
    closeModalEditArticle: () => store.actions.admin.setActiveArticle(null),
    closeModalEditCity: () => store.actions.admin.setActiveCity(null),
    closeModalAddArticle: () => setArticleToAdd(null),
    closeModalAddCity: () => setCityToAdd(null),
    closeDrawerLookArticle: () => store.actions.admin.setActiveArticle(null),
    editArticle: async () => {
      console.log('editArticle:', activeArticle);
      await store.actions.admin.editArticle(activeArticle);
      store.actions.admin.setActiveArticle(null);
    },
    editCity: async () => {
      await store.actions.admin.editCity(activeCity);
      store.actions.admin.setActiveCity(null);
    },
    addArticle: async () => {
      await store.actions.admin.addArticle(articleToAdd);
      setArticleToAdd(null);
    },
    addCity: async () => {
      await store.actions.admin.addCity(cityToAdd);
      setCityToAdd(null);
    },

    setActiveArticle,
    setActiveCity,
  };

  console.log({ activeArticle, articleToAdd });

  const options = {
    isModalEditArticleActive:
      Boolean(select.activeArticleId) && select.actionWithActiveArticle === 'edit',
    isModalEditCityActive: Boolean(select.activeCityId) && select.actionWithActiveCity === 'edit',

    isModalAddArticleActive: Boolean(articleToAdd),
    isSubmitDisabledAddArticleModal: articleToAdd
      ? articleToAdd.title.length < 4 || articleToAdd.price <= 0 || !articleToAdd.category._id
      : true,

    isModalAddCityActive: Boolean(cityToAdd),
    isSubmitDisabledAddCityModal: cityToAdd
      ? cityToAdd.title.length < 4 || cityToAdd.population <= 0
      : true,

    isLookArticleDrawerActive:
      Boolean(select.activeArticleId) && select.actionWithActiveArticle === 'look',
  };

  console.log({ drawerArticle: options.isLookArticleDrawerActive });

  const values = {
    activeArticle,
    activeCity,
    articleToAdd,
    cityToAdd,
  };

  // Поиск активного товара
  useEffect(() => {
    const activeArticle = select.catalogItems.find(
      (article) => article._id === select.activeArticleId
    );
    setActiveArticle(activeArticle);
  }, [select.activeArticleId]);

  // Поиск активного города
  useEffect(() => {
    const activeCity = select.catalogItems.find(
      (city) => city._id === select.activeCityId
    ) as unknown as TCity;
    setActiveCity(activeCity);
  }, [select.activeCityId]);

  const ctxValue = useMemo(
    () => ({
      select,
      handlers,
      callbacks,
      options,
      values,
    }),
    [select, handlers, callbacks, options, values]
  );

  const system = {
    activeMenuItem: [String(['/admin', '/admin/charts'].indexOf(location.pathname) + 1)],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className='demo-logo-vertical' />

        <Menu theme='dark' selectedKeys={system.activeMenuItem} mode='inline' items={items} />
      </Sider>
      <AdminContext.Provider value={ctxValue}>
        <AdminModals />
        <AdminDrawers />

        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: logoAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              width={300}
            />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <AdminBreadcrumbs />
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>Админ-панель {new Date().getFullYear()}</Footer>
        </Layout>
      </AdminContext.Provider>
    </Layout>
  );
}

export default {
  Root: memo(Admin),
  Tabs: memo(AdminTabs),
  Charts: memo(AdminCharts),
};
