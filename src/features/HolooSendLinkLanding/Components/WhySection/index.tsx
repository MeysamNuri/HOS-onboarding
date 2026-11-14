import {
  LinkOutlined,
PlusOutlined,

  ThunderboltFilled,
} from "@ant-design/icons";

import whyPhoneImage from "@/core/assets/images/landing/extracted/why-phone-device.png";
import Person from "@mui/icons-material/PersonPinOutlined";
import Article from "@mui/icons-material/ArticleOutlined";
import Campaign from "@mui/icons-material/CampaignOutlined";
import Receipt from "@mui/icons-material/ReceiptLongOutlined";
import Print from "@mui/icons-material/PrintOutlined";
import { whyFeatures } from "../../data/landingData";

import "./styles.scss";

const featureIcons = {
  bolt: <ThunderboltFilled />,
  campaign: <Campaign />,
  print: <Print />,
  link: <LinkOutlined />,
  receipt: <Receipt />,
};

export default function WhySection() {
  return (
    <section className="landing-why" id="landing-benefits">
      <header className="landing-why__heading">
        <h2>چرا اشتراک آنلاین اسناد</h2>
   
          <div className="holoo-landing-hero__badges" style={{justifyContent:"center",marginTop:"18px"}}>
            <span className="holoo-landing-hero__badge holoo-landing-hero__badge--blue">
              <Article aria-hidden="true"  style={{fontSize:"18px"}} />
              ارسال فاکتور آنلاین
            </span>
            <PlusOutlined className="holoo-landing-hero__badge-plus" aria-hidden="true" />
            <span className="holoo-landing-hero__badge holoo-landing-hero__badge--purple">
              <Person aria-hidden="true" style={{fontSize:"18px"}} />
              ارسال معین اشخاص آنلاین
            </span>
          </div>
      </header>

      <div className="landing-why__content">
        <div className="landing-why__visual" aria-hidden="true">
          <div className="landing-why__phone-crop">
            <img src={whyPhoneImage} alt="" />
          </div>
        </div>

        {whyFeatures.map((feature, index) => (
          <article
            className={`landing-why__feature landing-why__feature--${index + 1}`}
            key={feature.text}
          >
            <span>{featureIcons[feature.icon as keyof typeof featureIcons]}</span>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
