import { memo, useState } from "react";
import { Breadcrumb, Image, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Content, Footer, Header } from "antd/es/layout/layout";
import TopHead from "../top-head";
import logo from '../../assets/antLogo.svg';

function CMS() {
  const [collapsed, setCollapsed] = useState(false);
  const [bread, setBread] = useState<string[]>([])
  const navigate = useNavigate();
  const location = useLocation();

  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const items: ItemType[] = [
    { key: "Catalog", label: "Каталог", children: [
      {key: "Goods", label: "Товары"},
      {key: "Categories", label: "Категории"},
      {key: "Countries", label: "Страны"},
    ]},
    { key: "2", label: "Option 2"},
    { key: "Spinner", label: "Крутилка"},
  ]

  const onclick = (item: any) => {
    navigate(item.keyPath.reverse().join('/'), {state: {back: location.pathname}});
    setBread(item.keyPath);
  };

  let breadItems = bread.map(i => {
    return { title: <NavLink to="">{i}</NavLink> }
  })
  breadItems.unshift({ title: <NavLink to="/admin">Home</NavLink>})

  return (
    <Layout style={{minHeight: "100vh"}}>
      <Sider style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          top: 0,
          left: 0
        }} collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
        <NavLink to="/admin" style={{display: "flex", justifyContent: "center", margin: "10px 0"}} >
          <Image src={logo} preview={false} height={64} width={64}/>
        </NavLink>
        <Menu theme="dark" mode="inline" items={items} onClick={onclick}/>
      </Sider>
      <Layout>
        <Header style={{padding: "0 28px", backgroundColor: "transparent"}}>
          <TopHead />
        </Header>

          <Content style={{ padding: '0 48px' }}>
            <Breadcrumb items={breadItems} />
            <div style={{padding: "5px" ,background: colorBgContainer, borderRadius: borderRadiusLG}}>
              <Outlet/>
            </div>
          </Content>


        <Footer style={{ textAlign: 'center' }}>
          Ant Design CMS created by Anton {new Date().getFullYear()} for YLAB internship
        </Footer>
      </Layout>
    </Layout>
  );
}

export default memo(CMS);
