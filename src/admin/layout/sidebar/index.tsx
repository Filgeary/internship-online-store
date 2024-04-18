import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate  = useNavigate();
  const activeKey = window.location.pathname.slice(7);
  const { t } = useTranslate();
  const store = useStore();

  const menuItems: MenuProps["items"] = [
    { key: "", icon: <HomeOutlined />, label: t("admin.overview") },
    { key: "users", icon: <UserOutlined />, label: t("admin.users") },
    { key: "products", icon: <ShoppingCartOutlined />, label: t("admin.products") },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      collapsedWidth={60}
      reverseArrow
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <Menu
        style={{marginTop: 70}}
        defaultSelectedKeys={[activeKey]}
        items={menuItems}
        mode="inline"
        theme="dark"
        onClick={(item) => {
          navigate(item.key);
          store.actions["catalog_admin"]?.resetParams()
        }}
      />
    </Sider>
  );
};
