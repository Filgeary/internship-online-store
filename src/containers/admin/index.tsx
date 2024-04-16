import React, {
  useState,
  memo,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useRef,
} from 'react';
import Lottie from 'react-lottie';

import { Link, useLocation } from 'react-router-dom';

import logoAnimation from './assets/logo-animation.json';

import {
  BranchesOutlined,
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps, TablePaginationConfig } from 'antd';
import { Layout, Menu, theme, message } from 'antd';

import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

import AdminTabs from './admin-tabs';
import AdminModals from './admin-modals';
import AdminCharts from './admin-charts';
import AdminBreadcrumbs from './admin-breadcrumbs';
import AdminDrawers from './admin-drawers';
import AdminNotes from './admin-notes';
import AdminResults from './admin-results';

import { TCatalogArticle, TCatalogEntities } from '@src/store/catalog/types';
import { TCity } from '@src/store/admin/types';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

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

const routes = ['/admin', '/admin/charts', '/admin/notes', '/admin/results'];

const items: MenuItem[] = [
  getItem(<Link to={routes[0]}>Общее</Link>, '1', <PieChartOutlined />),
  getItem(<Link to={routes[1]}>Статистика</Link>, '2', <DesktopOutlined />),
  getItem(<Link to={routes[2]}>Заметки</Link>, '3', <FileOutlined />),
  getItem(<Link to={routes[3]}>Итоги</Link>, '4', <BranchesOutlined />),
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
    catalogSearch: state.catalog.params.query,
    catalogItems: state.catalog.list,
    catalogWaiting: state.catalog.waiting,

    limitByPage: state.catalog.params.limit,
    totalPagination: state.catalog.count,

    activeCatalogEntity: state.catalog.params.activeEntity,

    actionWithActiveArticle: state.admin.articles.actionWithActive,
    actionWithActiveCity: state.admin.cities.actionWithActive,

    totalArticlesCount: state.admin.articles.count,
    totalCitiesCount: state.admin.cities.count,
    totalNotesCount: state.notes.count,
  }));

  const [searchQuery, setSearchQuery] = useState(() => select.catalogSearch);

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

  const handlers = useMemo(
    () => ({
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
        store.actions.catalog.setParams({ page, limit: pageSize }, false);
      },
      onTableChange: (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue>,
        sorter: { field: string; order: string }
      ) => {
        console.log({ filters, sorter });
        switch (sorter.field) {
          case 'price': {
            let priceValue = 'price';
            if (sorter.order === 'descend') {
              priceValue = '-price';
            }
            store.actions.catalog.setParams({ sort: priceValue });
            break;
          }
        }
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
    }),
    [store]
  );

  const callbacks = useMemo(
    () => ({
      closeModalEditArticle: () => store.actions.admin.setActiveArticle(null),
      closeModalEditCity: () => store.actions.admin.setActiveCity(null),
      closeModalAddArticle: () => setArticleToAdd(null),
      closeModalAddCity: () => setCityToAdd(null),
      closeDrawerLookArticle: () => store.actions.admin.setActiveArticle(null),
      filterBySearch: () => {
        console.log('@', searchQuery);
        store.actions.catalog.setParams({ query: searchQuery });
      },
      editArticle: async () => {
        try {
          await store.actions.admin.editArticle(activeArticle);
          store.actions.admin.setActiveArticle(null);
          message.success('Изменено успешно!');
        } catch (err) {
          message.error(err.message);
        }
      },
      editCity: async () => {
        try {
          await store.actions.admin.editCity(activeCity);
          store.actions.admin.setActiveCity(null);
          message.success('Изменено успешно!');
        } catch (err) {
          message.error(err.message);
        }
      },
      addArticle: async () => {
        try {
          await store.actions.admin.addArticle(articleToAdd);
          setArticleToAdd(null);
          message.success('Добавлено успешно!');
        } catch (err) {
          message.error(err.message);
        }
      },
      addCity: async () => {
        try {
          await store.actions.admin.addCity(cityToAdd);
          setCityToAdd(null);
          message.success('Добавлено успешно!');
        } catch (err) {
          message.error(err.message);
        }
      },

      setActiveArticle,
      setActiveCity,
      setSearchQuery,
    }),
    [store, activeArticle, activeCity, articleToAdd, cityToAdd, searchQuery]
  );

  const options = useMemo(
    () => ({
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
    }),
    [
      store,
      select.activeArticleId,
      select.actionWithActiveArticle,
      select.activeCityId,
      select.actionWithActiveCity,
      articleToAdd,
      cityToAdd,
    ]
  );

  const values = useMemo(
    () => ({
      activeArticle,
      activeCity,
      articleToAdd,
      cityToAdd,
      searchQuery,
    }),
    [activeArticle, activeCity, articleToAdd, cityToAdd, searchQuery]
  );

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
    activeMenuItem: [String(routes.indexOf(location.pathname) + 1)],
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
                animationData: logoAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              isClickToPauseDisabled={true}
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
  Notes: memo(AdminNotes),
  Results: memo(AdminResults),
};
