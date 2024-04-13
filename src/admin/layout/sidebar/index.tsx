import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { menuItems } from "./menu";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const navigate  = useNavigate();
  const activeKey = window.location.pathname.slice(7);

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
        onClick={(item) => navigate(item.key)}
      />
    </Sider>
  );
};
