import { Flex, Spin } from "antd";

export const Loader = ({minHeight}: {minHeight: string}) => (
  <Flex
    style={{ width: "100%", minHeight }}
    justify="center"
    align="center"
  >
    <Spin />
  </Flex>
);
