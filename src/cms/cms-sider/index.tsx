import { Menu, Image } from "antd";
import Sider from "antd/es/layout/Sider";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import logo from "../../assets/antLogo.svg";
import { memo, useState } from "react";
import { AppstoreOutlined, BranchesOutlined, ClusterOutlined, Loading3QuartersOutlined, OrderedListOutlined } from "@ant-design/icons/lib/icons";

function CMSSider() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const callbacks = {
    onToggle: () => setCollapsed(!collapsed),
    onClick: (item: any) =>
      navigate(`/admin/${item.key}`, { state: { back: location.pathname } }),
  };

  const items: MenuItemType[] = [
    { key: "Catalog", label: "Каталог", icon: <AppstoreOutlined /> },
    { key: "Categories", label: "Категории", icon: <ClusterOutlined /> },
    { key: "Countries", label: "Страны", icon: <BranchesOutlined /> },
    { key: "list", label: "Каталог лист", icon: <OrderedListOutlined /> },
    { key: "spinner", label: "Крутилка", icon: <Loading3QuartersOutlined /> },
    { key: "test", label: "Test" },
  ];

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={callbacks.onToggle}
    >
      <NavLink to="/admin" style={{ display: "flex", justifyContent: "center", margin: "10px 0" }} >
        <Image src={logo} preview={false} height={64} width={64} />
      </NavLink>
      <Menu theme="dark" mode="inline" items={items} onClick={callbacks.onClick}/>
    </Sider>
  );
}

export default memo(CMSSider);
