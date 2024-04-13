import UserOutlined from "@ant-design/icons/UserOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import UserAddOutlined from "@ant-design/icons/UserAddOutlined";
import UserDeleteOutlined from "@ant-design/icons/UserDeleteOutlined";

export const cards = (
  title1: string,
  count1: number,
  title2: string,
  count2: number,
  title3: string,
  count3: number
) => [
  {
    title: title1,
    icon: <UserAddOutlined style={{ fontSize: 28 }} />,
    count: count1,
    color: "green",
    prefix: <ArrowUpOutlined />,
  },
  {
    title: title2,
    icon: <UserOutlined style={{ fontSize: 28 }} />,
    count: count2,
    color: "#1d39c4",
  },
  {
    title: title3,
    icon: <UserDeleteOutlined style={{ fontSize: 28 }} />,
    count: count3,
    color: "#d4380d",
    prefix: <ArrowDownOutlined />,
  },
];
