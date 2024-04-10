import React, { useState, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Tabs } from 'antd';

import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

import PaginationTable from '@src/components/pagination-table';
import FormEditArticle from '@src/components/form-edit-article';
import FormEditCity from '@src/components/form-edit-city';

import { TCatalogArticle } from '@src/store/catalog/types';
import { TCity } from '@src/store/admin/types';
import EditModal from '@src/components/edit-modal';

const { Header, Content, Footer, Sider } = Layout;

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
  getItem('Общее', '1', <PieChartOutlined />),
  getItem('Статистика', '2', <DesktopOutlined />),
  getItem('Администраторы', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Работники', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Примечания', '9', <FileOutlined />),
];

function AdminPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
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
  }));

  const [activeArticle, setActiveArticle] = useState<TCatalogArticle>(null);
  const [activeCity, setActiveCity] = useState<TCity>(null);

  const handlers = {
    onDeleteArticle: (id: string) => store.actions.admin.removeArticle(id),
    onDeleteCity: (id: string) => store.actions.admin.removeCity(id),

    onEditArticle: (id: string) => {
      store.actions.admin.setActiveArticle(id);
    },
    onEditCity: (id: string) => {
      store.actions.admin.setActiveCity(id);
    },
    onActiveArticleChange: (key: string, val: string | number) => {
      setActiveArticle((prevActiveArticle) => ({
        ...prevActiveArticle,
        [key]: val,
      }));
    },
    onActiveCityChange: (key: string, val: string | number) => {
      setActiveCity((prevActiveCity) => ({
        ...prevActiveCity,
        [key]: val,
      }));
    },
    onArticlesPaginationChange: (page: number, pageSize: number) => {
      store.actions.admin.setArticlesPage(page);
      store.actions.admin.setArticlesLimit(pageSize);
    },
    onCitiesPaginationChange: (page: number, pageSize: number) => {
      store.actions.admin.setCitiesPage(page);
      store.actions.admin.setCitiesLimit(pageSize);
    },
  };

  const callbacks = {
    closeModalEditArticle: () => store.actions.admin.setActiveArticle(null),
    closeModalEditCity: () => store.actions.admin.setActiveCity(null),
    editArticle: async () => {
      await store.actions.admin.editArticle(activeArticle);
      store.actions.admin.setActiveArticle(null);
    },
    editCity: async () => {
      await store.actions.admin.editCity(activeCity);
      store.actions.admin.setActiveCity(null);
    },
  };

  const options = {
    isModalEditArticleActive: Boolean(select.activeArticleId),
    isModalEditCityActive: Boolean(select.activeCityId),
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className='demo-logo-vertical' />
        <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline' items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link to='/'>Главная</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Админ-панель</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Tabs
              defaultActiveKey='1'
              items={[
                {
                  label: 'Товары',
                  key: '1',
                  children: (
                    <PaginationTable
                      onDelete={handlers.onDeleteArticle}
                      onEdit={handlers.onEditArticle}
                      onPaginationChange={handlers.onArticlesPaginationChange}
                      totalPagination={select.totalArticlesCount}
                      pageSize={select.articlesLimitByPage}
                      page={select.articlesPage}
                      loading={select.articlesFetching}
                      columns={[
                        {
                          title: 'Название',
                          dataIndex: 'title',
                          key: 'title',
                          fixed: 'left',
                        },
                        {
                          title: 'Цена',
                          dataIndex: 'price',
                          key: 'price',
                          fixed: 'left',
                          sorter: (a, b) => a.price - b.price,
                        },
                      ]}
                      data={select.articles}
                    />
                  ),
                },
                {
                  label: 'Города',
                  key: '2',
                  children: (
                    <PaginationTable
                      onDelete={handlers.onDeleteCity}
                      onEdit={handlers.onEditCity}
                      onPaginationChange={handlers.onCitiesPaginationChange}
                      totalPagination={select.totalCitiesCount}
                      pageSize={select.citiesLimitByPage}
                      page={select.citiesPage}
                      loading={select.citiesFetching}
                      columns={[
                        {
                          title: 'Название',
                          dataIndex: 'title',
                          key: 'title',
                          fixed: 'left',
                        },
                        {
                          title: 'Население',
                          dataIndex: 'population',
                          key: 'population',
                          fixed: 'left',
                          sorter: (a, b) => a.population - b.population,
                        },
                      ]}
                      data={select.cities}
                    />
                  ),
                },
              ]}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Админ-панель {new Date().getFullYear()}</Footer>
      </Layout>

      <EditModal
        title={'Изменение товара'}
        isOpen={options.isModalEditArticleActive}
        isBtnsDisabled={select.activeArticleFetching}
        onCancel={callbacks.closeModalEditArticle}
        onOk={callbacks.editArticle}
      >
        <FormEditArticle
          data={activeArticle || ({} as TCatalogArticle)}
          onChange={handlers.onActiveArticleChange}
        />
      </EditModal>

      <EditModal
        title={'Изменение города'}
        isOpen={options.isModalEditCityActive}
        isBtnsDisabled={select.activeCityFetching}
        onCancel={callbacks.closeModalEditCity}
        onOk={callbacks.editCity}
      >
        <FormEditCity data={activeCity || ({} as TCity)} onChange={handlers.onActiveCityChange} />
      </EditModal>
    </Layout>
  );
}

export default memo(AdminPanel);
