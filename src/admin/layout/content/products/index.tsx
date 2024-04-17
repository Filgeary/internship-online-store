import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { Button, Space } from "antd";
import { useCallback } from "react";
import {ProductsTable} from "./table/index.tsx";

export const Products = () => {
  const { t } = useTranslate();
  const store = useStore();

  useInit(async () => {
    await store.actions["catalog_admin"]?.initParams();
  })

  const callbacks = {
    addNewProduct: useCallback(() => {
      store.actions.modals.open("add_product").then((value: any) => {
        const body = {
          name: value.name,
          title: value.title,
          description: value.description || "",
          price: value.price,
          madeIn: {
            _id: value.country,
          },
          edition: value.edition["$y"],
          category: {
            _id: value.category,
          },
        };
        store.actions["catalog_admin"]?.create(JSON.stringify(body));
      });
    }, [store]),
  };

  return (
    <>
      <Head title={t("admin.products")}>
        <LocaleSelect />
      </Head>
      <Space direction="vertical" style={{display: 'flex'}}>
        <Button type="primary" onClick={callbacks.addNewProduct}>+{t('admin.addRecord')}</Button>
        <ProductsTable/>
      </Space>
    </>
  );};
