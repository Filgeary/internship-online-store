import { Drawer, Spin, Typography } from "antd";
import { FC, useCallback } from "react";
import { ArticleDrawerProps } from "./type";
import useSelector from "@src/hooks/use-selector";
import ArticleCard from "@src/components/article-card";
import useTranslate from "@src/hooks/use-translate";
import useStore from "@src/hooks/use-store";

export const ArticleInfo: FC<ArticleDrawerProps> = ({ open, onClose }) => {
  const select = useSelector((state) => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }));
  const { t } = useTranslate();
  const store = useStore();
  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(
      async (_id: string) => {
        const storeName = "count";
        store.actions.modals
          .open(storeName)
          .then((count) =>
            store.actions.basket.addToBasket(_id, count as number)
          );
      },
      [store]
    ),
  };
  return (
    <Drawer onClose={onClose} size="large" open={open}>
      <Spin tip="loading" spinning={select.waiting}>
        <Typography.Title level={2} style={{marginLeft: 40}}>{select.article.title}</Typography.Title>
        <ArticleCard
          article={select.article}
          onAdd={callbacks.addToBasket}
          labelAdd={t("article.add")}
        />
      </Spin>
    </Drawer>
  );
};
