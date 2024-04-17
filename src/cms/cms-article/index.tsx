import { Button, Col, Form, Input, Row, Select } from "antd";
import { memo, useEffect, useRef } from "react"
import { convertAtricleToFormItem, convertFormItemToArticleDTO } from "../../utils/cms/article-from-converter";
import { ArticleType } from "../../store/article/types";
import { ArticleDTOType } from "../../store/cms-article/types";

type CMSArticlePropsType = {
  article?: ArticleType;
  categories: any[];
  countries: any[];
  isSubmitting: boolean;
  onSubmit: (data: ArticleDTOType) => void;
}

function CMSArticle(props: CMSArticlePropsType) {

  const formRef = useRef(null);
  let article = {
    _id: "",
    name: "",
    title: "",
    price: 0,
    category: "",
    madeIn: "",
    description: "",
  }
  useEffect(() => {
    if(props.article)
      article = convertAtricleToFormItem(props.article);
    formRef.current.setFieldsValue(article)
  }, [])

  const callbacks = {
    submit: (e) => props.onSubmit(convertFormItemToArticleDTO({...e, _id: article._id, name: article.name}))
  }

  return (
    <Form ref={formRef} layout="vertical" onFinish={callbacks.submit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label="Наименование"
                     rules={[{required: true, message: "Введите наименование" },
                             {min: 2, max: 100, message: "Наименование должны быть в пределах от 2-х до 100 символов"}]}>
            <Input placeholder="Введите наименование"/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="price" label="Цена">
            <Input placeholder="Цена товара" type="number"/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="category" label="Категория" rules={[{required: true, message: "Выберите категорию"}]}>
            <Select options={props.categories}/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="madeIn" label="Страна" rules={[{required: true, message: "Выберите страну"}]}>
            <Select options={props.countries}/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="description" label="Описание">
            <Input.TextArea placeholder="Описание товара" rows={4}/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} style={{display: "flex", justifyContent: "flex-end"}}>
        <Col>
            <Button type="primary" htmlType="submit" loading={props.isSubmitting}>Сохранить</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default memo(CMSArticle);
