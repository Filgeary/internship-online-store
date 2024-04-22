import React, { FC, memo, useState } from 'react'
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd'

const { Option } = Select

interface IDrawer {
  onClose: () => void
  onSubmit: (nameValue: string, priceValue: number | string, descriptionValue: string) => void
  open: boolean
}

const _Drawer: FC<IDrawer> = memo(({ onClose, open, onSubmit }) => {
  const [nameValue, setNameValue] = useState('')
  const [priceValue, setPriceValue] = useState('0')
  const [descriptionValue, setDescriptionValue] = useState('')

  const headerSubmit = () => {
    onSubmit(nameValue, Number(priceValue), descriptionValue)
  }

  return (
    <>
      <Drawer
        title="Редактирование"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Отменить</Button>
            <Button onClick={headerSubmit} type="primary">
              Отправить
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Название"
                rules={[{ required: true, message: nameValue }]}
              >
                <Input value={nameValue} onChange={e => setNameValue(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Category"
                label="Категория"
                rules={[{ required: true, message: '65f8322bf3360f03347a6bd3' }]}
              >
                <Input placeholder="Редактирование временно недоступно" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="country"
                label="Производитель"
                rules={[{ required: true, message: '65f8321bf3360f03347a607a' }]}
              >
                <Input placeholder="Редактирование временно недоступно" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Прайс"
                rules={[{ required: true, message: priceValue }]}
              >
                <Input value={priceValue} onChange={e => setPriceValue(e.target.value)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Описание"
                rules={[
                  {
                    required: true,
                    message: descriptionValue,
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder=""
                  onChange={e => setDescriptionValue(e.target.value)}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
})

export default _Drawer
