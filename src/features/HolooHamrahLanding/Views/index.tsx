import { CheckOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SupportAgent from "@mui/icons-material/SupportAgent";
import checkbook from "@core/assets/icons/checkbook.png";
import checkbookWhite from "@core/assets/icons/checkboo-white.png";
import { useEffect, useId, useState } from "react";
import { Link } from "react-router";
import { Alert, Button, Spin } from "antd";
import useUserInfo from "@/core/components/hooks/useUserInfo";
import json from "@/core/constants/config.json";
import BottomModal from "@/core/components/customModal";
import ChooseSerialModal from "@/core/components/chooseSerialModal";
import LandingNavigation from "../Components/LandingNavigation";
import GettingStarted from "../Components/GettingStarted";
import ActivationResult from "../Components/ActivationResult";
import useHamrahActivation from "../Hooks/useHamrahActivation";
import useSimpleServicePacket from "@/core/components/hooks/useSimpleServicePacket";
import { formatRial } from "@/core/helper/formatRial";
import { NumberConverter } from "@/core/helper/numberConverter";
import useHolooHamrah from "../Hooks/useHolooHamrah";
import { packageFeatures } from "../data/landingData";
import lightPhones from "@/core/assets/images/holoo-hamrah/phones-light.png";
import darkPhones from "@/core/assets/images/holoo-hamrah/phones-dark.png";
import "./styles.scss";

export default function HolooHamrah() {
  const { isUserLoading, isUserReady, refreshUser } = useUserInfo();
  const catalog = useSimpleServicePacket("BI");
  const selectedPlan = catalog.selectedPlan;
  const activation = useHamrahActivation(selectedPlan);
  const { theme, setTheme } = useHolooHamrah();
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const orbitId = useId();
  const glowId = useId();
  const phones = theme === "dark" ? darkPhones : lightPhones;

  useEffect(() => {
    if (localStorage.getItem("authToken") && localStorage.getItem("serviceCode") === "BI" && localStorage.getItem("openModalStorage") === "activationModal") setActivationModalOpen(true);
  }, []);

  const handleFreeActivation = () => {
    if (!selectedPlan || catalog.isLoading) return;
    localStorage.setItem("openModalStorage", "activationModal");
    localStorage.setItem("serviceCode", "BI");
    sessionStorage.setItem("activationPage", window.location.pathname);
    localStorage.setItem("packetCode", selectedPlan.code);
    if (!localStorage.getItem("authToken")) {
      window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${json.backUrl}/home&scope=openid%20profile%20persona:read&state=home`;
      return;
    }
    setActivationModalOpen(true);
  };

  const closeActivationModal = () => { setActivationModalOpen(false); localStorage.removeItem("openModalStorage"); };

  return (
    <div className={"holoo-hamrah holoo-hamrah--" + theme} dir="rtl">
      <section className="hamrah-hero" aria-labelledby="hamrah-title">
        <svg className="hamrah-hero__orbit" viewBox="0 0 1200 290" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="#ff3333" />
              <stop offset="55%" stopColor="#ff6666" />
              <stop offset="100%" stopColor="#ffb3b3" />
            </radialGradient>
            <path id={orbitId} d="M 0 145 C 0 224 242 288 540 288 L 660 288 C 958 288 1200 224 1200 145" />
          </defs>
          <use className="hamrah-hero__orbit-line" href={"#" + orbitId} />
          <g className="hamrah-hero__spark">
            <ellipse rx="24" ry="5" fill={"url(#" + glowId + ")"} />
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" calcMode="linear" keyPoints="0;1;0" keyTimes="0;0.5;1">
              <mpath href={"#" + orbitId} />
            </animateMotion>
          </g>
        </svg>
        <header className="hamrah-header hamrah-container">
          <LandingNavigation />
          <div className="hamrah-header__actions">
            <Link className="hamrah-account" to="/support" aria-label="حساب کاربری و مدیریت بسته‌ها"><SupportAgent /></Link>
            <div className="hamrah-theme" role="group" aria-label="انتخاب تم">
              <button type="button" onClick={() => setTheme("dark")} aria-label="تم تیره" aria-pressed={theme === "dark"}><MoonOutlined /></button>
              <button type="button" onClick={() => setTheme("light")} aria-label="تم روشن" aria-pressed={theme === "light"}><SunOutlined /></button>
            </div>
          </div>
        </header>
        <div className="hamrah-hero__inner hamrah-container">
          <div className="hamrah-hero__content">
            <p className="hamrah-eyebrow">داشبورد مدیریتی نرم‌افزار هلو</p>
            <h1 id="hamrah-title">کسب‌وکارتان، همیشه همراهتان</h1>
            <p className="hamrah-hero__description">فروش، موجودی و وضعیت چک‌ها را با گوشی ببینید؛<br />هر جا که هستید، از کسب‌وکارتان باخبر بمانید.</p>
            <div className="hamrah-hero__actions">
              <button type="button" className="hamrah-button" onClick={() => { window.open(json.demoHolooHamrah, "_self"); }}>مشاهده دمو</button>
              {/* <Link className="hamrah-button hamrah-button--outline" to="/BI-guide">راهنمای راه‌اندازی</Link> */}
            </div>
          </div>
          <img className="hamrah-hero__phones" src={phones} alt="داشبورد هلو همراه در حالت روشن و تیره روی گوشی" width="460" height="500" fetchPriority="high" />
        </div>
      </section>
      <main>
        <GettingStarted />
        <section className="hamrah-package hamrah-container" aria-labelledby="hamrah-package-title">
          <div className="hamrah-package__content">
            <h2 id="hamrah-package-title">{selectedPlan?.name ?? "بستهٔ هلو همراه"}</h2>
            <p>{selectedPlan?.description || "اطلاعات مهم کسب‌وکارتان، در یک داشبورد ساده و در دسترس."}</p>
            <ul>{(selectedPlan?.featureList?.length ? selectedPlan.featureList : packageFeatures).map((feature) => <li key={feature}><CheckOutlined aria-hidden="true" />{feature}</li>)}</ul>
          </div>
          <div className="hamrah-package__price">
            <strong>{catalog.isLoading ? <Spin /> : selectedPlan ? Number(selectedPlan.salesPrice) === 0 ? "رایگان" : formatRial(selectedPlan.salesPrice / 10) + " تومان" : "—"}</strong>
            <button type="button" className="hamrah-button" disabled={catalog.isLoading || !selectedPlan} onClick={handleFreeActivation}>فعال‌سازی بسته</button>
            {selectedPlan && <span>{NumberConverter.latinToArabic(String(selectedPlan.lable))} </span>}
            {!catalog.isLoading && !selectedPlan && <Alert type="error" title="بستهٔ پایه در دسترس نیست." action={<Button onClick={() => void catalog.refetch()}>تلاش مجدد</Button>} />}
          </div>
        </section>
        <section id="hamrah-features" className="hamrah-features hamrah-container" aria-label="امکانات هلو همراه">
          <article className="hamrah-feature hamrah-feature--sales"><BarChartOutlinedIcon className="hamrah-feature__icon" aria-hidden="true" /><h2>فروش امروز را ببینید</h2></article>
          <article className="hamrah-feature hamrah-feature--balance"><AccountBalanceWalletOutlinedIcon className="hamrah-feature__icon" aria-hidden="true" /><h2>موجودی حساب‌ها را بررسی کنید</h2></article>
          <article className="hamrah-feature hamrah-feature--checks"><img width={30} className="hamrah-feature__icon" src={theme === "dark" ? checkbookWhite : checkbook} alt=""/>  <h2>از وضعیت چک‌ها باخبر شوید</h2></article>
        </section>
        <section className="hamrah-support" aria-labelledby="hamrah-support-title">
          <div className="hamrah-container hamrah-support__inner">
            <div><h2 id="hamrah-support-title">برای شروع، کنارتان هستیم</h2><p>دانلود یا فعال‌سازی انجام نشد؟ راهنما را ببینید یا با پشتیبانی در ارتباط باشید.</p></div>
            <div className="hamrah-support__actions">
              {/* <Link className="hamrah-button" to="/BI-guide">راهنمای راه‌اندازی</Link> */}
              <Link className="hamrah-button " to="/support">تماس با پشتیبانی</Link></div>
          </div>
        </section>
      </main>
      <BottomModal open={activationModalOpen} onClose={closeActivationModal} fitContent>
        {isUserLoading || catalog.isLoading ? (
          <Spin aria-label="در حال دریافت اطلاعات کاربر" />
        ) : !selectedPlan ? (
          <Alert type="error" title="اطلاعات بسته دریافت نشد." action={<Button onClick={() => void catalog.refetch()}>تلاش مجدد</Button>} />
        ) : isUserReady ? (
          <ChooseSerialModal packetCode={selectedPlan.code} onCancel={closeActivationModal} onSubmit={activation.handleSubmit} isSubmitting={activation.isSubmitting} />
        ) : (
          <Alert type="error" showIcon title="اطلاعات کاربر و شماره موبایل دریافت نشد." action={<Button onClick={() => void refreshUser()}>تلاش مجدد</Button>} />
        )}
      </BottomModal>
      <ActivationResult />
      <footer className="hamrah-footer hamrah-container"><LandingNavigation />
                <Link className="hamrah-account" to="/support" aria-label="حساب کاربری و مدیریت بسته‌ها"><SupportAgent /></Link>
      </footer>
    </div>
  );
}
