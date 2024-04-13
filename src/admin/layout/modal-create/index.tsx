import ModalLayout from "@src/components/modal-layout";
import useModalId from "@src/hooks/use-modalId";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { useCallback, useMemo } from "react";

export const ModalCreateProduct = () => {
  const store = useStore();
  const select = useSelector((state) => ({
    countries: state["countries_admin"]?.list,
    countriesWaiting: state["countries_admin"]?.waiting,
    categories: state["categories_admin"]?.list,
    categoriesWaiting: state["categories_admin"]?.waiting,
  }));
  const modalId = useModalId();
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
      console.log(modalId);
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
      title={"Add new product"}
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
          label="Name"
          name="name"
          validateTrigger="onBlur"
          rules={[{ min: 2, required: true }]}
        >
          <Input placeholder="Validate required onBlur" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Title"
          name="title"
          validateTrigger="onBlur"
          rules={[{ min: 2, required: true }]}
        >
          <Input placeholder="Validate required onBlur" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          validateTrigger="onBlur"
          rules={[{ required: true }]}
        >
          <InputNumber addonAfter="₽" />
        </Form.Item>
        <Form.Item
          label="Edition"
          name="edition"
          validateTrigger="onBlur"
          rules={[{ required: true }]}
        >
          <DatePicker
            picker="year"
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
          />
        </Form.Item>
        <Form.Item
          label="Country"
          name="country"
          validateTrigger="onBlur"
          rules={[{ required: true }]}
        >
          <Select
            options={options.countries}
            placeholder="Please select a country"
            loading={select.countriesWaiting}
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
          />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          validateTrigger="onBlur"
          rules={[{ required: true }]}
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </ModalLayout>
  );
};
