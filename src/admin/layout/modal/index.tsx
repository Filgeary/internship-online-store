import ModalLayout from "@src/components/modal-layout";
import useModalId from "@src/hooks/use-modalId";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";

export const ModalProduct = ({title, isEditModal}: {title: string, isEditModal?: boolean}) => {
  const store = useStore();
  const select = useSelector((state) => ({
    countries: state["countries_admin"]?.list,
    countriesWaiting: state["countries_admin"]?.waiting,
    categories: state["categories_admin"]?.list,
    categoriesWaiting: state["categories_admin"]?.waiting,
    modals: state.modals.list
  }));
  const modalId = useModalId();

  const article = useSelector((state) => state.article.data);

  const options = {
    countries: useMemo(
      () =>
        select.countries?.map((country) => ({
          value: country._id,
          label: country.title,
        })),
      [select.countries]
    ),
    categories: useMemo(
      () =>
        select.categories?.map((category) => ({
          value: category._id,
          label: category.title,
        })),
      [select.categories]
    ),
  };

  const callbacks = {
    onClose: useCallback(() => {
      store.actions.modals.close(modalId!);
    }, [store, modalId]),
    onSubmit: useCallback(
      (values: string[]) => {
        store.actions.modals.close(modalId!, values);
      },
      [store, modalId]
    ),
  };
  const { t } = useTranslate();

  return (
    <ModalLayout
      title={title}
      isClose={true}
      labelClose={t("modal.close")}
      onClose={callbacks.onClose}
    >
      <Form
        name="product_form"
        autoComplete="off"
        scrollToFirstError
        style={{ padding: 20 }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        onFinish={callbacks.onSubmit}
      >
        <Form.Item
          hasFeedback
          label={t("admin.table.name")}
          name="name"
          validateTrigger="onBlur"
          rules={[{ min: 2, required: isEditModal ? false : true }]}
          initialValue={isEditModal ? article.name : ""}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label={t("admin.table.title")}
          name="title"
          validateTrigger="onBlur"
          rules={[{ min: 2, required: isEditModal ? false : true }]}
          initialValue={isEditModal ? article.title : ""}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          label={t("admin.table.description")}
          name="description"
          initialValue={isEditModal ? article.description : ""}
        >
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>
        <Form.Item
          label={t("admin.table.price")}
          name="price"
          validateTrigger="onBlur"
          rules={[{ required: isEditModal ? false : true }]}
          initialValue={isEditModal ? article.price : ""}
        >
          <InputNumber addonAfter="₽" placeholder="Enter price" />
        </Form.Item>
        <Form.Item
          label={t("admin.table.edition")}
          name="edition"
          validateTrigger="onBlur"
          rules={[{ required: isEditModal ? false : true }]}
          initialValue={isEditModal ? dayjs().year(article.edition) : ""}
        >
          <DatePicker
            picker="year"
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
          />
        </Form.Item>
        <Form.Item
          label={t("admin.table.country")}
          name="madeIn"
          validateTrigger="onBlur"
          rules={[{ required: isEditModal ? false : true }]}
          initialValue={isEditModal && article.madeIn ? article.madeIn._id : ""}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={options.countries}
            placeholder="Please select a country"
            loading={select.countriesWaiting}
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
          />
        </Form.Item>
        <Form.Item
          label={t("admin.table.category")}
          name="category"
          validateTrigger="onBlur"
          rules={[{ required: isEditModal ? false : true }]}
          initialValue={
            isEditModal && article.category ? article.category._id : ""
          }
        >
          <Select
            placeholder="Please select a category"
            options={options.categories}
            loading={select.categoriesWaiting}
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
          />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" htmlType="submit">
            {t("admin.submit")}
          </Button>
        </Form.Item>
      </Form>
    </ModalLayout>
  );
};
