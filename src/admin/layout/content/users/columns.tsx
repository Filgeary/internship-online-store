import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { Flex, Tag } from "antd";
import { v4 as uuidv4 } from "uuid";

export const columns = (onDelete: (_id: string) => void) => [
  {
    title: "Username",
    dataIndex: "username",
    sorter: true,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Status",
    dataIndex: "status",
    filters: [
      { text: "New", value: "new" },
      { text: "Confirm", value: "confirm" },
      { text: "Reject", value: "reject" },
    ],
    render: (status: string) => {
      let color = status.length > 6 ? "geekblue" : "volcano";
      if (status === "new") {
        color = "green";
      }

      return (
        <Tag color={color} key={uuidv4()}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: "Date Create",
    sorter: true,
    dataIndex: "dateCreate",
  },
  {
    title: "Actions",
    dataIndex: "_id",
    render: (_id: string) => (
      <Flex justify="center">
        <DeleteOutlined
          onClick={() => onDelete(_id)}
          style={{ color: "red", cursor: "pointer" }}
        />
      </Flex>
    ),
  },
];
