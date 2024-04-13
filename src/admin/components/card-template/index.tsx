import { Card, Space, Statistic } from "antd";
import { CardProps } from "./type";
import { FC } from "react";

export const CardTemplate: FC<CardProps> = ({
  icon,
  title,
  count,
  suffix,
  color,
  precision,
  prefix,
}) => (
  <Card bordered={false}>
    <Space direction="horizontal" size="middle">
      {icon}
      <Statistic
        title={title}
        value={count}
        precision={precision}
        valueStyle={{ color: color }}
        prefix={prefix}
        suffix={suffix}
      >
      </Statistic>
    </Space>
  </Card>
);
