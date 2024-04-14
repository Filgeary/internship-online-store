import { HomeOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Flex, Layout, Menu, Typography, theme } from 'antd';
import * as React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import logo from './assets/logo.svg';
import AdminArticles from './pages/admin-articles';

const { Header, Content, Footer, Sider } = Layout;

const menuRoutesWithIcons = [
  { label: 'Home', icon: HomeOutlined },
  { label: 'Profile', icon: UserOutlined },
  { label: 'articles', icon: NumberOutlined },
  { label: 'users', icon: NumberOutlined },
];

const items: MenuProps['items'] = menuRoutesWithIcons.map((item, index) => ({
  key: String(index),
  icon: React.createElement(item.icon),
  label: item.label,
}));

const Admin = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const path = String(location.pathname.split('/')[2]);

  const matchedIndex = menuRoutesWithIcons.findIndex(item => item.label.toLowerCase() === path);
  const selectedKeys = matchedIndex > -1 ? matchedIndex.toString() : '0';

  const handleNavigate = (item: any) => {
    const label = menuRoutesWithIcons[+item.key].label.toLowerCase();
    return label === 'home' ? '' : label;
  };

  return (
    <Layout hasSider>
      <Sider
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <Flex
          gap={16}
          align='center'
          justify='center'
          style={{ height: 64 }}
        >
          <img
            src={logo}
            width={32}
            height={32}
            alt='Logo'
          />
          <Typography.Title
            level={3}
            style={{ color: token.colorTextLightSolid, textAlign: 'center', margin: 0 }}
          >
            YLab
          </Typography.Title>
        </Flex>

        <Menu
          theme='dark'
          mode='inline'
          items={items}
          selectedKeys={[selectedKeys]}
          onSelect={item => navigate(handleNavigate(item))}
        />
      </Sider>

      <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
        <Header style={{ background: token.colorBgContainer }}>
          <Flex
            align='center'
            style={{ height: '100%' }}
          >
            <Typography.Title
              level={1}
              style={{ margin: 0 }}
            >
              Admin Panel
            </Typography.Title>
          </Flex>
        </Header>

        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
            borderRadius: token.borderRadiusLG,
            padding: '24px',
            background: token.colorBgContainer,
          }}
        >
          <Routes>
            <Route
              path={'/'}
              element={
                <Typography.Title
                  level={3}
                  style={{ textAlign: 'center' }}
                >
                  Welcome $Username / TODO:
                </Typography.Title>
              }
            />
            <Route
              path={'/profile'}
              element={<Typography.Title level={2}>TODO: My Profile</Typography.Title>}
            />
            <Route
              path={'/users'}
              element={<Typography.Title level={2}>TODO: Users List</Typography.Title>}
            />
            <Route
              path={'/articles'}
              element={<AdminArticles />}
            />
          </Routes>
        </Content>

        <Footer style={{ marginTop: 'auto', padding: '0 24px' }}>
          <Typography.Title level={3}>Footer</Typography.Title>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Admin;
