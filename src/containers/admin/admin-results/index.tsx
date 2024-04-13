import { memo } from 'react';

import { FundProjectionScreenOutlined, ProfileOutlined, TruckOutlined } from '@ant-design/icons';
import { Card, Row, Statistic, Col, Skeleton } from 'antd';

import { useAdminContext } from '..';

function AdminResults() {
  const { select } = useAdminContext();

  return (
    <Row gutter={[16, 16]}>
      <Col span={4}>
        {select.articlesFetching ? (
          <Skeleton.Button
            style={{ height: 110 }}
            active={true}
            size={'large'}
            shape={'square'}
            block
          />
        ) : (
          <Card bordered={false}>
            <Statistic
              title='Товаров'
              value={select.totalArticlesCount}
              prefix={<FundProjectionScreenOutlined />}
            />
          </Card>
        )}
      </Col>

      <Col span={4}>
        {select.articlesFetching ? (
          <Skeleton.Button
            style={{ height: 110 }}
            active={true}
            size={'large'}
            shape={'square'}
            block
          />
        ) : (
          <Card bordered={false}>
            <Statistic title='Городов' value={select.totalCitiesCount} prefix={<TruckOutlined />} />
          </Card>
        )}
      </Col>

      <Col span={4}>
        <Card bordered={false}>
          <Statistic title='Заметок' value={3} prefix={<ProfileOutlined />} />
        </Card>
      </Col>
    </Row>
  );
}

export default memo(AdminResults);
