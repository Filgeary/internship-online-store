import ModalLayout from "@src/components/modal-layout"
import useModalId from "@src/hooks/use-modalId";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { Button, DatePicker, Form, Input, InputNumber } from "antd"
import { useCallback } from "react";

export const ModalEdit = () => {
  const { t } = useTranslate();
  const modalId = useModalId();
  const store = useStore();

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
  return (
    <ModalLayout
      title={"Edit product"}
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
          label="Title"
          name="title"
          validateTrigger="onBlur"
          rules={[{ min: 2 }]}
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
        >
          <InputNumber addonAfter="₽" />
        </Form.Item>
        <Form.Item
          label="Edition"
          name="edition"
          validateTrigger="onBlur"
        >
          <DatePicker
            picker="year"
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
          />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </ModalLayout>
)}
