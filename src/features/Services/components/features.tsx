import { Card, Row, Col } from "antd";
import {
  CheckOutlined,
} from "@ant-design/icons";
import "./styles/features.scss";
import useFeatureHooks from "../hooks/featuresHooks";




const FeaturesCard = () => {
  const { features, isDesktop } = useFeatureHooks()
  return (

    <div className="features-container">

   <Row>
        <Col span={24} >
          {

            isDesktop ?
              <div className="invoice-features">
                {features.map((item, index) => (
                  <div className="invoice-features__card" key={index}>
                    <div className="invoice-features__icon">

                      <img src={item.icon} />
                    </div>

                    <div className="invoice-features__title">
                      {item.text}
                    </div>


                  </div>
                ))}
              </div> :
              <Card className="features-card">

                {features.map((item, index) => (
                  <Row key={index} align="middle" className="feature-row">
                    {/* Left check icon */}
                    <Col xs={{ span: 4 }} sm={{ span: 4 }} md={{ span: 1 }} lg={{ span: 1 }} className="check-col">
                      <div className="action-icon">
                        <img src={item.icon} />
                      </div>
                    </Col>

                    {/* Text */}
                    <Col xs={{ span: 20 }} sm={{ span: 20 }} md={{ span: 23 }} lg={{ span: 23 }} flex="auto" className="text-col">
                      {item.text}
                    </Col>

                    {/* Right red icon */}
                    <Col className="action-col">

                      <div className="check-icon">
                        <CheckOutlined />
                      </div>
                    </Col>
                  </Row>
                ))}
              </Card>
          }


        </Col>
      </Row>
    </div>
  );
};

export default FeaturesCard;