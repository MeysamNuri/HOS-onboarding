import {
  FilePdfOutlined,
  PlusOutlined,
  ShareAltOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import Person from "@mui/icons-material/PersonPinOutlined";
import Article from "@mui/icons-material/ArticleOutlined";

import heroPhones from "@/core/assets/images/landing/icons/hero-phones.png";
import heroLeftLine from "@/core/assets/images/landing/icons/left-line.svg";
import heroRightLine from "@/core/assets/images/landing/icons/right-line-path.svg";
import heroBackground from "@/core/assets/images/landing/hero-background.svg";
import mobileHeroVisual from "@/core/assets/images/landing/mobile/hero-phone.png";
 
import "./styles.scss";

interface HeroSectionProps {
  onFreeActivation: () => void;
  onSendSample: () => void;
}

export default function HeroSection({
  onFreeActivation,
  onSendSample,
}: HeroSectionProps) {
  return (
    <main className="holoo-landing-hero">
      <img
        className="holoo-landing-hero__background"
        src={heroBackground}
        alt=""
        aria-hidden="true"
      />
      <span className="holoo-landing-hero__mobile-top-line" aria-hidden="true" />
      <div className="holoo-landing-hero__inner">
        <img
          className="holoo-landing-hero__mobile-visual"
          src={mobileHeroVisual}
          alt=""
          aria-hidden="true"
        />

        <section className="holoo-landing-hero__content">
          <div className="holoo-landing-hero__eyebrow holoo-landing-hero__eyebrow--desktop">
            <strong>اشتراک آنلاین اسناد</strong>
            <span>یک تیر و دو نشان</span>
          </div>

          <strong className="holoo-landing-hero__mobile-title">
            اشتراک آنلاین اسناد
          </strong>

          <div className="holoo-landing-hero__badges">
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

          <span className="holoo-landing-hero__mobile-tagline">یک تیر و دو نشان</span>

          <h1>
            هر ارسال، یک ارتباط
            <span>ماندگار با مشتری</span>
          </h1>

          <p className="holoo-landing-hero__description">
            فاکتور و معین اشخاص را آنلاین ارسال کنید، مشتری مشاهده کند، دانلود کند و
            همیشه در دسترس باشد.
          </p>

          <ul className="holoo-landing-hero__benefits" aria-label="مزایای هلو لینک">
            <li>اشتراک‌گذاری</li>
            <li>دانلود PDF</li>
            <li>نمایش شعار</li>
            <li>مشاهده آنلاین</li>
          </ul>
        </section>

        <div className="holoo-landing-hero__visual" aria-label="نمای هلو لینک در موبایل">
          <img
            className="holoo-landing-hero__orbit holoo-landing-hero__orbit--left"
            src={heroLeftLine}
            alt=""
            aria-hidden="true"
          />
          <img
            className="holoo-landing-hero__orbit holoo-landing-hero__orbit--right"
            src={heroRightLine}
            alt=""
            aria-hidden="true"
          />
          <span
            className="holoo-landing-hero__visual-icon holoo-landing-hero__visual-icon--share"
            aria-hidden="true"
          >
            <ShareAltOutlined />
          </span>
          <span
            className="holoo-landing-hero__visual-icon holoo-landing-hero__visual-icon--wifi"
            aria-hidden="true"
          >
            <WifiOutlined />
          </span>
          <span
            className="holoo-landing-hero__visual-icon holoo-landing-hero__visual-icon--document"
            aria-hidden="true"
          >
            <FilePdfOutlined />
          </span>
          <img
            className="holoo-landing-hero__phones"
            src={heroPhones}
            alt="نمای فاکتور و معین اشخاص آنلاین در دو تلفن همراه"
          />
        </div>

        <div className="holoo-landing-hero__actions">
          <button
            type="button"
            className="holoo-landing-hero__primary-button"
            onClick={onFreeActivation}
          >
            <span>فعال‌سازی نسخه رایگان</span>
          </button>
          <button
            type="button"
            className="holoo-landing-hero__secondary-button"
            onClick={onSendSample}
          >
            <span>ارسال نمونه</span>
          </button>
        </div>
      </div>
    </main>
  );
}
