import { Col, Row, Image, Typography } from "antd";
import { Link } from 'react-router'
import logo from '@core/assets/images/holoo.png'
import {
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
export default function Footer() {
  const { Title } = Typography
  return (

    <Row className="footer" >
      <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 20, offset: 2 }} >
        <Row >
          <Col xs={24} sm={24} md={16} lg={16} >
            <div className="footer-address">
              <Image src={logo} alt="holoo logo" preview={false} width={100} style={{marginBottom:"10px"}}/>
              <p>گروه فناوری اطلاعات هلو در سال ۱۳۷۷ برای تولید نرم‌افزارهای مالی و حسابداری کسب‌وکارها تأسیس 
                شد.
                <br/>
                این مجموعه با ارائه راهکارهای تخصصی، نیازهای مدیریتی اصناف مختلف را پوشش می‌دهد.</p>
              <p><EnvironmentOutlined style={{ marginLeft: "6px" }} />  آدرس دفتر مرکزی: تهران خیابان میرداماد-خیابان البرز-ساختمان طرفه نگار </p>
              <p > <PhoneOutlined style={{ marginLeft: "6px" }} /> تلفن: ۰۲۱۲۲۹۰۲۳۸۰ </p>
            </div>
          </Col>



          <Col xs={24} sm={24} md={8} lg={8} >
            <Title level={4}>خدمات آنلاین نرم افزار هلو</Title>

            <ul>
              <li>
                <Link to="/home"> خانه  </Link>

              </li>
              <li>
                <Link to="/plans/BI" >   هلو همراه </Link>

              </li>
              <li>
                <Link to="/sendLink">اشتراک آنلاین اسناد</Link>

              </li>
            </ul>
          </Col>


          <Col span={24} className="copy-right">
            <p>© تمامی حقوق این اثر برای گروه فناوری اطلاعات هلو محفوظ است.</p>
          </Col>
        </Row>

      </Col>
    </Row>

  )
}
