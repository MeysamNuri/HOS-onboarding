import { useState } from "react";
import { Modal } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import channelBanner from "@core/assets/images/banner-propose/Banner.png";
import supportBanner from "@core/assets/images/banner-propose/Banner5.png";
import supportBanner2 from "@core/assets/images/banner-propose/Banner6.png";
import installBanner from "@core/assets/images/banner-propose/Banner2.png";
import { installApp } from "@/core/pwa/installApp";

export default function SupportBanners() {
  const [installationMessage, setInstallationMessage] = useState("");
  const handleInstall = async () => {
    try {
      const result = await installApp();
      if (result === "installed") {
        setInstallationMessage("اپلیکیشن روی دستگاه شما نصب شده است.");
      } else if (result === "unavailable") {
        setInstallationMessage("از منوی مرورگر گزینه «نصب برنامه / Install app» را انتخاب کنید. در آیفون و آیپد، سایت را در Safari باز کنید و از منوی اشتراک‌گذاری، «افزودن به صفحه اصلی / Add to Home Screen» را بزنید. اگر گزینه نصب وجود ندارد، نصب در این مرورگر یا در حال حاضر در دسترس نیست.");
      }
    } catch {
      setInstallationMessage("نمایش درخواست نصب امکان‌پذیر نشد. لطفاً دوباره تلاش کنید یا از گزینه نصب در منوی مرورگر استفاده کنید.");
    }
  };

  return (
    <>
      <Swiper
        className="support-banners"
        dir="rtl"
        modules={[A11y, Autoplay, Keyboard]}
        slidesPerView={1}
        breakpoints={{ 769: { slidesPerView: 2 } }}
        spaceBetween={16}
        speed={650}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        keyboard={{ enabled: true }}
        aria-label="بنرهای پشتیبانی"
      >
        <SwiperSlide>
          <a className="support-banners__item" href="https://portfolio.invalid/HolooOnlineC" target="_blank" rel="noopener noreferrer">
            <img className="support-banners__image--channel" src={channelBanner} alt="خبرهای تازه و فرصت‌های ویژه؛ به کانال بله هلو آنلاین بپیوندید" />
          </a>
        </SwiperSlide>
        <SwiperSlide>
          <div className="support-banners__item">
            <img className="support-banners__image--support" src={supportBanner} alt="همیشه در کنار شما هستیم؛ پشتیبانی ۲۴ ساعته در بله. ساعت کاری کارشناس: شنبه تا چهارشنبه ۸ الی ۱۷، پنجشنبه ۸ الی ۱۳" />
          </div>
        </SwiperSlide>
       
        <SwiperSlide>
          <button type="button" className="support-banners__item support-banners__install" onClick={() => void handleInstall()}>
            <img className="support-banners__image--install" src={installBanner} alt="نصب اپلیکیشن هلو آنلاین؛ افزودن به میانبر" />
          </button>
        </SwiperSlide>
         <SwiperSlide>
          <div className="support-banners__item">
            <img className="support-banners__image--support-secondary" src={supportBanner2} alt="همیشه در کنار شما هستیم؛ پشتیبانی ۲۴ ساعته در بله. ساعت کاری کارشناس: شنبه تا چهارشنبه ۸ الی ۱۷، پنجشنبه ۸ الی ۱۳" />
          </div>
        </SwiperSlide>
      </Swiper>
      <Modal title="نصب اپلیکیشن هلو آنلاین" open={Boolean(installationMessage)} onCancel={() => setInstallationMessage("")} onOk={() => setInstallationMessage("")} cancelButtonProps={{ style: { display: "none" } }} okText="متوجه شدم">
        <p dir="rtl">{installationMessage}</p>
      </Modal>
    </>
  );
}
