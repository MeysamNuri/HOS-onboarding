
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Pdf from "@mui/icons-material/PictureAsPdfOutlined";
import Gift from "@mui/icons-material/CardGiftcardOutlined";
import Agent from "@mui/icons-material/SupportAgentOutlined";
import Phone from "@mui/icons-material/PhoneOutlined";
import Reply from "@mui/icons-material/QuickreplyOutlined";
import Wallet from "@mui/icons-material/AccountBalanceWalletOutlined";
import Sync from "@mui/icons-material/Sync";
import supportArrow from "@/core/assets/images/landing/support-arrow.png";

import "./styles.scss";
import { Button } from "antd";

interface SupportSectionProps {
  onFreeActivation: () => void;
  onOpenGuide: () => void;
}

export default function SupportSection({
  onFreeActivation,
  onOpenGuide,
}: SupportSectionProps) {
  return (
    <section className="landing-support" id="landing-support">
      <header className="landing-section-heading">
        <h2>هنوز مطمئن نیستید؟</h2>
        <p>ما اینجاییم تا انتخاب درست را آسان‌تر کنیم.</p>
      </header>
      <div className="swiper-container">
        <Swiper
          className="landing-support__cards"
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={16}
          speed={750}
          rewind
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            861: {
              slidesPerView: 4,
              spaceBetween: 30,
              allowTouchMove: false,
            },
          }}
          dir="rtl"
          aria-label="راه‌های دریافت راهنمایی و فعال‌سازی"
        >
          <SwiperSlide className="landing-support__slide">
            <article>
              <span className="landing-support__card-icon landing-support__card-icon--yellow"><Pdf /></span>
              <h3>دانلود راهنمای فعالسازی</h3>
              <p>آموزش مرحله به مرحله ی فعاسازی تمام سرویس ها</p>
              <button type="button" onClick={onOpenGuide}>دانلود راهنما</button>
            </article>
          </SwiperSlide>
          <SwiperSlide className="landing-support__slide">
            <article>
              <span className="landing-support__card-icon landing-support__card-icon--purple"><Gift /></span>
              <h3>بررسی یا فعال‌سازی بسته هدیه</h3>
              <p>فعال‌سازی آزمایشی و بررسی بازخورد مشتریان شما</p>
              <button type="button" onClick={onFreeActivation}>فعال‌سازی رایگان</button>
            </article>
          </SwiperSlide>
          <SwiperSlide className="landing-support__slide">
            <article>
              <span className="landing-support__card-icon landing-support__card-icon--blue"><Agent /></span>
              <h3>پشتیبانی سریع در پیام‌رسان</h3>
              <p>پیام مستقیم به کارشناسان پشتیبانی فنی</p>
              <Button type="default" disabled={true} style={{opacity:".5"}}>شروع چت آنلاین</Button>
            </article>
          </SwiperSlide>
          <SwiperSlide className="landing-support__slide">
            <article>
              <span className="landing-support__card-icon landing-support__card-icon--red"><Phone /></span>
              <h3>مشاوره مستقیم تلفنی</h3>
              <p>برای انتخاب مطمئن‌تر با کارشناسان ما صحبت کنید</p>
              <a href="tel:00000000000">00000000000</a>
            </article>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="landing-support__guarantees-wrap">
        <img className="landing-support__guarantees-arrow" src={supportArrow} alt="" aria-hidden="true" />
        <div className="landing-support__guarantees">
          <span><Agent /> پشتیبانی ۲۴/۷</span>
          <span><Reply /> فعال‌سازی سریع</span>
          <span><Wallet /> پرداخت امن</span>
          <span><Sync /> تمدید آسان</span>
        </div>
      </div>
    </section>
  );
}
