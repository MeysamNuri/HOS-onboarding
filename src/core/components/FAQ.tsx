import { Col, Row, ConfigProvider, Collapse, Typography } from "antd";
import type { CollapseProps } from 'antd';
import { LeftOutlined } from '@ant-design/icons'


interface FAQProps {
  questions: CollapseProps['items'];
}
export default function FAQ({ questions }: FAQProps) {

  const { Title } = Typography
  return (
    <Row className="holoo-sections" >
      <Col span={24}>
        <Title level={3}>سوالات متداول</Title>
      </Col>

      <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20, offset: 2 }} >
        <ConfigProvider direction="ltr">
          <Collapse items={questions} expandIcon={LeftOutlined} defaultActiveKey={['1']} />

        </ConfigProvider>
      </Col>
    </Row>
  )
}
