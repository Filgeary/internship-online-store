import { Space } from "antd";
import useSelector from "@src/hooks/use-selector";
import { CardTemplate } from "@src/admin/components/card-template";
import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import CommentOutlined from "@ant-design/icons/CommentOutlined";
import ShoppingCartOutlined from "@ant-design/icons/ShoppingCartOutlined";
import UsergroupAddOutlined from "@ant-design/icons/UsergroupAddOutlined";
import useTranslate from "@src/hooks/use-translate";
import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import { Suspense, lazy } from "react";
import { Loader } from "../../spin";
const PieCategory = lazy(() => import("./pie"));

export const Overview = () => {
  const select = useSelector((state) => ({
    countUsers: state.users.count,
    newUsers: state.users.newCount,
    countGoods: state["catalog_admin"]?.count,
    countComments: state.comments.count
  }));
  const {t} = useTranslate();

  const cards = [
    {
      title: t("admin.newUsers"),
      icon: <UsergroupAddOutlined style={{ fontSize: 28 }} />,
      count: (select.newUsers / select.countUsers) * 100,
      suffix: "%",
      precision: 2,
      color: "#3f8600",
      prefix: <ArrowUpOutlined />,
    },
    {
      title: t("admin.sumProd"),
      icon: <ShoppingCartOutlined style={{ fontSize: 28 }} />,
      count: select.countGoods,
      suffix: t("basket.unit"),
    },
    {
      title: t("admin.comments"),
      icon: <CommentOutlined style={{ fontSize: 28 }} />,
      count: select.countComments
    },
  ];

  return (
    <>
      <Head title={t("admin.title")}>
        <LocaleSelect />
      </Head>
      <Space direction="horizontal" size={"middle"} style={{marginBottom: 20}}>
        {cards.map((card) => (
          <CardTemplate
            key={card.title}
            title={card.title}
            icon={card.icon}
            count={card.count!}
            suffix={card.suffix}
            color={card.color}
            prefix={card.prefix}
            precision={card.precision}
          />
        ))}
      </Space>
      <Suspense fallback={<Loader minHeight={'20vh'}/>}>
        <PieCategory />
      </Suspense>
    </>
  );
};
