import {
  UserOutlined,
  ShoppingCartOutlined,
  GlobalOutlined,
  AppstoreOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";

export const menuItems: MenuProps["items"] = [
  { key: "", icon: <HomeOutlined />, label: "Overview" },
  { key: "users", icon: <UserOutlined />, label: "Users" },
  { key: "products", icon: <ShoppingCartOutlined />, label: "Products" },
  { key: "countries", icon: <GlobalOutlined />, label: "Countries" },
  { key: "categories", icon: <AppstoreOutlined />, label: "Categories" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
];
