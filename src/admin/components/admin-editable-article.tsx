import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, Spin, Typography } from 'antd';
import { useState } from 'react';

import useInit from '@src/hooks/use-init';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';

import type { IArticle } from '@src/types/IArticle';

const { Text } = Typography;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, article: IArticle) => void;
  articleId: string;
};

const AdminEditableArticle = ({ isOpen, onClose, onSubmit, articleId }: Props) => {
  const store = useStore();
  const { t } = useTranslate();

  useInit(() => {
    store.actions.article.load(articleId);
  }, []);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }));

  const article = select.article;
  const [editableArticleState, setEditableArticleState] = useState<IArticle | null>({
    ...({} as IArticle),
  });

  const handleClose = () => {
    setEditableArticleState(null);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(article?._id || '', editableArticleState ?? ({} as IArticle));
  };

  return (
    <Drawer
      title={'Edit article'}
      width={720}
      onClose={handleClose}
      open={isOpen}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            type='primary'
          >
            Submit
          </Button>
        </Space>
      }
    >
      <Spin spinning={select.waiting}>
        {article && editableArticleState && (
          <>
            <Form
              layout='vertical'
              initialValues={article}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name='title'
                    label='Title'
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder='Title'
                      value={editableArticleState.title}
                      onChange={evt => {
                        setEditableArticleState({
                          ...editableArticleState,
                          title: evt.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name='description'
                    label='Description'
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder='Description'
                      value={editableArticleState.description}
                      onChange={evt => {
                        setEditableArticleState({
                          ...editableArticleState,
                          description:
                            evt.target.value + ' | ' + new Date().toLocaleString('ru-RU'),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name='price'
                    label='Price'
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ minWidth: 150 }}
                      placeholder='Price'
                      value={editableArticleState.price}
                      onChange={price => {
                        setEditableArticleState({
                          ...editableArticleState,
                          price: price || 0,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row
              gutter={[0, 16]}
              style={{ flexDirection: 'column' }}
            >
              <Space direction='vertical'>
                <Text>{t('admin.catalog.madeIn')}</Text>
                <Text strong>
                  {article.madeIn?.title} ({article.madeIn?.code})
                </Text>
              </Space>
              <Space direction='vertical'>
                <Text>{t('admin.catalog.category')}</Text>
                <Text strong>{article.category?.title}</Text>
              </Space>
              <Space direction='vertical'>
                <Text>{t('admin.catalog.edition')}</Text>
                <Text strong>{article.edition}</Text>
              </Space>
            </Row>
          </>
        )}
      </Spin>
    </Drawer>
  );
};

export default AdminEditableArticle;
