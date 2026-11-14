import ble from "@/core/assets/icons/bale.svg";

import "./styles.scss";

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__top">
        <div>
          <h2>اشتراک آنلاین اسناد</h2>
          <p>هر ارسال، یک ارتباط ماندگار با مشتری</p>
        </div>
        <nav aria-label="پیوندهای پایین صفحه">
          <a href="#landing-benefits">امکانات مدیریتی</a>
          <a href="#landing-packages">بسته‌های اشتراک</a>
          <a href="/sendLink-help">راهنمای استفاده</a>
          <a href="#landing-support">پشتیبانی</a>
        </nav>
      </div>
      <div className="landing-footer__bottom">
        <p>تمام حقوق این وب‌سایت متعلق به گروه فناوری اطلاعات هلو است.</p>
        <a href="https://portfolio.invalid/holooonline" target="_blank" rel="noopener noreferrer">
          <img src={ble} alt="ble" />
        </a>
      </div>
    </footer>
  );
}
