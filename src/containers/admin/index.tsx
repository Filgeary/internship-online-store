import React, { useState, memo, useEffect, createContext, useContext, useMemo } from 'react';

import { Link, useLocation } from 'react-router-dom';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';

import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

import { TCatalogArticle } from '@src/store/catalog/types';

import AdminTabs from './admin-tabs';
import AdminModals from './admin-modals';
import AdminCharts from './admin-charts';
import AdminBreadcrumbs from './admin-breadcrumbs';

import { TCity } from '@src/store/admin/types';

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
  getItem('Примечания', '9', <FileOutlined />),
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
    articles: state.admin.articles.list,
    articlesFetching: state.admin.articles.fetching,
    activeArticleId: state.admin.articles.active,
    activeArticleFetching: state.admin.articles.activeFetching,
    articlesLimitByPage: state.admin.articles.limit,
    totalArticlesCount: state.admin.articles.count,
    articlesPage: state.admin.articles.page,

    cities: state.admin.cities.list,
    citiesFetching: state.admin.cities.fetching,
    activeCityId: state.admin.cities.active,
    activeCityFetching: state.admin.cities.activeFetching,
    citiesPage: state.admin.cities.page,
    citiesLimitByPage: state.admin.cities.limit,
    totalCitiesCount: state.admin.cities.count,

    categories: state.categories.list,
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
    onDeleteArticle: (id: string) => store.actions.admin.removeArticle(id),
    onDeleteCity: (id: string) => store.actions.admin.removeCity(id),
    onEditArticle: (id: string) => store.actions.admin.setActiveArticle(id),
    onEditCity: (id: string) => store.actions.admin.setActiveCity(id),

    onActiveArticleChange: helpers.keyValueChanger(setActiveArticle, ['category']),
    onActiveCityChange: helpers.keyValueChanger(setActiveCity),
    onArticleToAddChange: helpers.keyValueChanger(setArticleToAdd, ['category']),
    onCityToAddChange: helpers.keyValueChanger(setCityToAdd),

    onArticlesPaginationChange: (page: number, pageSize: number) => {
      store.actions.admin.setArticlesPage(page);
      store.actions.admin.setArticlesLimit(pageSize);
    },
    onCitiesPaginationChange: (page: number, pageSize: number) => {
      store.actions.admin.setCitiesPage(page);
      store.actions.admin.setCitiesLimit(pageSize);
    },
    onAddArticleBtnClick: () => {
      setArticleToAdd({ title: '', price: 0, category: { _id: null } } as TCatalogArticle);
    },
    onAddCityBtnClick: () => {
      setCityToAdd({ title: '', population: 0 } as TCity);
    },
  };

  const callbacks = {
    closeModalEditArticle: () => store.actions.admin.setActiveArticle(null),
    closeModalEditCity: () => store.actions.admin.setActiveCity(null),
    closeModalAddArticle: () => setArticleToAdd(null),
    closeModalAddCity: () => setCityToAdd(null),
    editArticle: async () => {
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

  const options = {
    isModalEditArticleActive: Boolean(select.activeArticleId),
    isModalEditCityActive: Boolean(select.activeCityId),

    isModalAddArticleActive: Boolean(articleToAdd),
    isSubmitDisabledAddArticleModal: articleToAdd
      ? articleToAdd.title.length < 4 || articleToAdd.price <= 0 || !articleToAdd.category._id
      : true,

    isModalAddCityActive: Boolean(cityToAdd),
    isSubmitDisabledAddCityModal: cityToAdd
      ? cityToAdd.title.length < 4 || cityToAdd.population <= 0
      : true,
  };

  const values = {
    activeArticle,
    activeCity,
    articleToAdd,
    cityToAdd,
  };

  // Поиск активного товара
  useEffect(() => {
    setActiveArticle(select.articles.find((article) => article._id === select.activeArticleId));
  }, [select.activeArticleId]);

  // Поиск активного города
  useEffect(() => {
    setActiveCity(select.cities.find((city) => city._id === select.activeCityId));
  }, [select.activeCityId]);

  // Синхронизация текущих продуктов с текущей страницей
  useEffect(() => {
    store.actions.admin.fetchArticles();
  }, [select.articlesPage, select.articlesLimitByPage]);

  // Синхронизация городов с текущей страницей
  useEffect(() => {
    store.actions.admin.fetchCities();
  }, [select.citiesPage, select.citiesLimitByPage]);

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
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
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
