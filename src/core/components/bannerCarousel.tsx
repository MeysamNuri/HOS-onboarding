import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router'
import Banner1 from "@core/assets/images/banner-main/des-1.png";
import Banner2 from "@core/assets/images/banner-main/des-2.png";
import Banner3 from "@core/assets/images/banner-main/des-3.png";
import mobileBanner1 from "@core/assets/images/banner-main/mob-1.png";
import mobileBanner2 from "@core/assets/images/banner-main/mob-2.png";
import mobileBanner3 from "@core/assets/images/banner-main/mob-3.png";

import "./styles/bannerCarousel.scss";

export const BANNER_AUTOPLAY_DELAY = 8000;

interface BannerSlideData {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title: string;
  desktopDescription: string;
  mobileDescription: string;
  buttonText: string;
  showButton: boolean;
  guideTabId?: number;
}

export const bannerSlides: BannerSlideData[] = [
    {
    id: "green-invoice",
    desktopImage: Banner2,
    mobileImage: mobileBanner2,
    title: "ارسال فاکتور آنلاین",
    desktopDescription: "احترام به زمین با حذف کاغذ، احترام به زمان با سرعت ارسال.",
    mobileDescription: "احترام به زمین با حذف کاغذ، احترام به زمان با سرعت ارسال.",
    buttonText: "راهنمای استفاده",
    showButton: true,
    guideTabId: 1,
  },
  {
    id: "accounts",
    desktopImage: Banner1,
    mobileImage: mobileBanner1,
    title: "معین اشخاص، حالا آنلاین",
    desktopDescription: "تنها با یک کلیک گزارش معین اشخاص را به گوشی طرف حساب ارسال نمایید",
    mobileDescription: "تنها با یک کلیک گزارش معین اشخاص را به گوشی طرف حساب ارسال نمایید",
    buttonText: "راهنمای استفاده",
    showButton: true,
    guideTabId: 2,

  },

  {
    id: "smart-business",
    desktopImage: Banner3,
    mobileImage: mobileBanner3,
    title: "یک قدم تا کسب‌وکار هوشمند",
    desktopDescription: "هر فاکتور یک ارتباط ماندگار، هوشمند و حرفه ای با مشتری.",
    mobileDescription: "هر فاکتور یک ارتباط ماندگار، هوشمند و حرفه ای با مشتری.",
    buttonText: "راهنمای استفاده",
    showButton: false,

  },
];

export default function BannerCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const autoplayTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % bannerSlides.length);
    }, BANNER_AUTOPLAY_DELAY);

    return () => window.clearInterval(autoplayTimer);
  }, []);

  return (
    <section className="banner-carousel" aria-roledescription="carousel">
      <div className="banner-carousel__viewport" aria-live="polite">
        <BannerSlide slide={bannerSlides[activeSlide]} />
      </div>

      <div className="banner-carousel__pagination">
        {bannerSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`banner-carousel__dot ${index === activeSlide ? "banner-carousel__dot--active" : ""}`}
            aria-label={`نمایش بنر ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

function BannerSlide({ slide }: { slide: BannerSlideData }) {
  const navigate = useNavigate();

  const handleGuide = () => {
    const search = slide.guideTabId ? `?tab=${slide.guideTabId}` : "";
    navigate(`/sendLink-help${search}`);
  };

  return (
    <article className="banner-slide">
      <picture className="banner-slide__picture">
        <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
        <img className="banner-slide__image" src={slide.desktopImage} alt={slide.title} />
      </picture>

      <div className="banner-slide__content">
        <h2 className="banner-slide__title">{slide.title}</h2>
        <p className="banner-slide__description banner-slide__description--desktop">
          {slide.desktopDescription}
        </p>
        <p className="banner-slide__description banner-slide__description--mobile">
          {slide.mobileDescription}
        </p>
        {slide.showButton && (
          <button type="button" className="banner-slide__button" onClick={handleGuide}>
            {slide.buttonText}
            <LeftOutlined aria-hidden="true" />
          </button>
        )}

      </div>
    </article>
  );
}
