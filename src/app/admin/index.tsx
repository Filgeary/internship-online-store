import { HomeOutlined, NumberOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Flex, Layout, Menu, Typography, theme } from 'antd';
import * as React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const menuRoutesWithIcons = [
  { label: 'Home', icon: HomeOutlined },
  { label: 'User', icon: UserOutlined },
  { label: 'articles', icon: NumberOutlined },
  { label: 'countries', icon: NumberOutlined },
  { label: 'cities', icon: NumberOutlined },
];

const items: MenuProps['items'] = menuRoutesWithIcons.map((item, index) => ({
  key: String(index),
  icon: React.createElement(item.icon),
  label: item.label,
}));

const Admin = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, colorTextLightSolid },
  } = theme.useToken();
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
        <Typography.Title
          level={3}
          style={{ color: colorTextLightSolid, textAlign: 'center' }}
        >
          Logo
        </Typography.Title>
        <Menu
          theme='dark'
          mode='inline'
          items={items}
          selectedKeys={[selectedKeys]}
          onSelect={item => navigate(handleNavigate(item))}
        />
      </Sider>

      <Layout style={{ marginLeft: 200, minHeight: '100vh' }}>
        <Header style={{ padding: 24, background: colorBgContainer }}>
          <Flex
            align='center'
            style={{ height: '100%' }}
          >
            <Typography.Title level={1}>Admin Panel</Typography.Title>
          </Flex>
        </Header>

        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
            borderRadius: borderRadiusLG,
            padding: '0 24px',
            background: colorBgContainer,
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
                  Welcome $Username
                </Typography.Title>
              }
            />
            <Route
              path={'/user'}
              element={<Typography.Title level={2}>User Profile</Typography.Title>}
            />
            <Route
              path={'/articles'}
              element={<Typography.Title level={2}>Articles</Typography.Title>}
            />
            <Route
              path={'/countries'}
              element={<Typography.Title level={2}>Countries</Typography.Title>}
            />
            <Route
              path={'/cities'}
              element={<Typography.Title level={2}>Cities</Typography.Title>}
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
