import React, { useState, memo, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Tabs, Modal, Button } from 'antd';
import { Link } from 'react-router-dom';

import PaginationTable from '@src/components/pagination-table';

import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import FormEditArticle from '@src/components/form-edit-article';
import { TCatalogArticle } from '@src/store/catalog/types';

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
    activeArticleId: state.admin.articles.active,
    activeArticleFetching: state.admin.articles.activeFetching,
    cities: state.admin.cities.list,
  }));

  const [activeArticle, setActiveArticle] = useState<TCatalogArticle>(null);

  useEffect(() => {
    setActiveArticle(select.articles.find((article) => article._id === select.activeArticleId));
  }, [select.activeArticleId]);

  const handlers = {
    onDeleteArticle: (id: string) => store.actions.admin.removeArticle(id),
    onDeleteCity: (id: string) => store.actions.admin.removeCity(id),

    onEditArticle: (id: string) => {
      console.log(`Буду редактировать товар: ${id}`);
      store.actions.admin.setActiveArticle(id);
    },
    onEditCity: (id: string) => {
      console.log(`Буду редактировать товар: ${id}`);
    },
    onActiveArticleChange: (key: string, val: string | number) => {
      console.log({ key, val });

      setActiveArticle((prevActiveArticle) => ({
        ...prevActiveArticle,
        [key]: val,
      }));
    },
  };

  const callbacks = {
    closeModalEditArticle: () => store.actions.admin.setActiveArticle(null),
    editArticle: () => store.actions.admin.editArticle(activeArticle),
  };

  const options = {
    isModalEditArticleActive: Boolean(select.activeArticleId),
  };

  useEffect(() => {
    console.log('Продукты:', select.articles);
    console.log('Города:', select.cities);
  }, [select.articles]);

  useEffect(() => {
    console.log('Активный товар:', select.activeArticleId);
  }, [select.activeArticleId]);

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

      <Modal
        title={'Изменение товара'}
        open={options.isModalEditArticleActive}
        onCancel={callbacks.closeModalEditArticle}
        footer={[
          <Button disabled={select.activeArticleFetching} key='cancel' type='default'>
            Отмена
          </Button>,

          <Button
            disabled={select.activeArticleFetching}
            key='submit'
            type='primary'
            onClick={callbacks.editArticle}
          >
            Изменить
          </Button>,
        ]}
      >
        <FormEditArticle
          data={activeArticle || ({} as TCatalogArticle)}
          onChange={handlers.onActiveArticleChange}
        />
      </Modal>
    </Layout>
  );
}

export default memo(AdminPanel);
