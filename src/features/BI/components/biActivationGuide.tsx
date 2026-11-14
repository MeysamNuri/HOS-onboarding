import { useEffect, type ReactNode } from "react";
import {
    FileTextOutlined,
    MobileOutlined,
    RocketOutlined,
    ThunderboltFilled,
    WalletOutlined,
} from "@ant-design/icons";

import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import PagesHeader from "@/core/components/pagesHeader";
import hourglassImage from "../assets/bi-guide-hourglass.png";
import phonesImage from "../assets/bi-guide-phones.png";
import phonesMobileImage from "../assets/bi-guide-phones-mobile.png";
import useBIHooks from "../Hooks/BIHooks";

import "./styles/biActivationGuide.scss";

interface FeatureItem {
    icon: ReactNode;
    text: string;
}

const features: FeatureItem[] = [
    {
        icon: <ThunderboltFilled />,
        text: "بدانید در کسب‌وکارتان چه می‌گذرد، حتی وقتی حضور ندارید",
    },
    {
        icon: <WalletOutlined />,
        text: "وضعیت فروش، نقدینگی و تعهدات مالی را یکجا ببینید",
    },
    {
        icon: <FileTextOutlined />,
        text: "فرصت‌ها و چالش‌ها را زودتر شناسایی کنید",
    },
    {
        icon: <MobileOutlined />,
        text: "با آرامش بیشتر و امن و مطمئن برای آینده تصمیم بگیرید",
    },
];

export default function BIActivationGuideView() {
    const { checkPaymentLoading } = useBIHooks();

    useEffect(() => {
        document.body.classList.add("bi-guide-page");

        return () => {
            document.body.classList.remove("bi-guide-page");
        };
    }, []);

    if (checkPaymentLoading) return <AjaxLoadingComponent />;

    return (
        <main className="page-container bi-activation-guide">
            <PagesHeader title="راهنمای هلو همراه" />

            <section className="bi-activation-guide__hero" aria-labelledby="bi-guide-title">
                <div className="bi-activation-guide__notice">
                    <RocketOutlined aria-hidden="true" />
                    <p>
                        شما از <strong>اولین</strong> افرادی خواهید بود که از آماده شدن سرویس مطلع می‌شوید و
                        یک <strong>ماه رایگان</strong> از آن استفاده خواهید کرد
                    </p>
                </div>

                <img
                    className="bi-activation-guide__hourglass"
                    src={hourglassImage}
                    alt="سرویس هلو همراه در حال آماده‌سازی است"
                />

                <h1 id="bi-guide-title" className="bi-activation-guide__title">
                    <RocketOutlined aria-hidden="true" />
                    <span>در حال آماده‌سازی تجربه‌ای جدید برای مدیریت کسب‌وکار شما هستیم</span>
                </h1>

                <p className="bi-activation-guide__description">
                    فروش، دریافت‌ها، چک‌ها و وضعیت مالی کسب‌وکارتان را هرجا که هستید ببینید.
                </p>
            </section>

            <section className="bi-activation-guide__features" aria-labelledby="bi-features-title">
                <header className="bi-activation-guide__features-header">
                    <h2 id="bi-features-title">ویژگی‌ها</h2>
                    <p>هلو همراه؛ مدیریت کسب‌وکار همیشه همراه شما</p>
                </header>

                <div className="bi-activation-guide__features-layout">
                    <div className="bi-activation-guide__visual">
                        <picture>
                            <source media="(max-width: 991px)" srcSet={phonesMobileImage} />
                            <img src={phonesImage} alt="نمای اپلیکیشن هلو همراه در تلفن همراه" />
                        </picture>
                    </div>

                    <ul className="bi-activation-guide__feature-list">
                        {features.map((feature) => (
                            <li key={feature.text}>
                                <span className="bi-activation-guide__feature-icon" aria-hidden="true">
                                    {feature.icon}
                                </span>
                                <span>{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}
