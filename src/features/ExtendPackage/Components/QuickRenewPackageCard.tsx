import { Button } from "antd";
import Campain from "@core/assets/icons/campaign.svg"
import { CheckOutlined, CrownOutlined } from "@ant-design/icons";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import MilitaryTechOutlinedIcon from "@mui/icons-material/WorkspacePremium";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";

import { NumberConverter } from "@/core/helper/numberConverter";
import type { IServicePacketOBG } from "@/core/types/models";

import "./quickRenewPackageCard.scss";

const getPackageIcon = (plan: IServicePacketOBG) => {
  const code = plan.code.trim().toUpperCase();
  const name = plan.name.trim();

  if (["START", "SIMPLE"].includes(code) || name.includes("آغاز")) {
    return CardGiftcardOutlinedIcon;
  }
  if (code === "NOVA" || name.includes("نوپا")) return ElectricBoltOutlinedIcon;
  if (code === "GROWTH" || name.includes("رشد")) return SpaOutlinedIcon;
  if (code === "WORK" || name.includes("بسته ویژه") || name === "بسته ویژه") {
    return StarsOutlinedIcon;
  }
  if (code === "LEAD" || name.includes("پیشرو")) return RocketLaunchOutlinedIcon;
  if (code === "PRO" || name.includes("حرفه")) return ShieldOutlinedIcon;
  if (code === "GOLD" || name.includes("طلایی")) return EmojiEventsOutlinedIcon;
  if (code === "DIAMOND" || name.includes("الماس")) return DiamondOutlinedIcon;
  if (code === "PLATINUM" || name.includes("پلاتینیوم")) {
    return MilitaryTechOutlinedIcon;
  }

  return StarsOutlinedIcon;
};

export function PackageIcon({ plan }: { plan: IServicePacketOBG }) {
  const Icon = getPackageIcon(plan);

  return <Icon fontSize="inherit" />;
}

interface QuickRenewPackageCardProps {
  plan: IServicePacketOBG;
  variant?: "featured" | "standard";
  isPopular?: boolean;
  isRecommended?: boolean;
  isFreeTrial?: boolean;
  selectedPlan?: IServicePacketOBG;
  activationLoading: boolean;
  onSelect: (plan: IServicePacketOBG) => void;
  onShowDetails: (plan: IServicePacketOBG) => void;
}

const formatPrice = (price: number) =>
  NumberConverter.latinToArabic(
    NumberConverter.formatNumberWithCommas(Number(price ?? 0) / 10),
  );

const formatNumber = (value: number | string) =>
  NumberConverter.latinToArabic(String(value));

const getPackageFeatures = (plan: IServicePacketOBG) => {
  const apiFeatures = (plan.featureList ?? []).filter(Boolean);
  const durationInMonths = Math.max(1, Math.round(Number(plan.duration ?? 30) / 30));
  const fallbackFeatures = [
    plan.sendCount
      ? `تا ${formatNumber(plan.sendCount)} ارتباط با مشتری`
      : "",
    `${formatNumber(durationInMonths)} ماه دسترسی`,
  ].filter(Boolean);

  return [...fallbackFeatures, ...apiFeatures].slice(0, 2);
};

export default function QuickRenewPackageCard({
  plan,
  variant = "standard",
  isPopular = false,
  isRecommended = false,
  isFreeTrial = false,
  selectedPlan,
  activationLoading,
  onSelect,
  onShowDetails,
}: QuickRenewPackageCardProps) {
  const features = getPackageFeatures(plan);
  const isNormalUser = plan.type === "Normal";
  const badgeText = isRecommended
    ? "پیشنهاد ویژه"
    : isFreeTrial
      ? "تست رایگان ویژه مشتریان"
      : isPopular
    ? "محبوب‌ترین"
    : isNormalUser
      ? "ویژه کاربران عادی"
      : "ویژه کاربران پرمصرف";
  const discount = formatNumber(plan.discountPercent || 0);
  const isLoading = plan.code === selectedPlan?.code && activationLoading;

  if (variant === "featured") {
    return (
      <article className="quick-renew-package-card quick-renew-package-card--featured">
        <span className="quick-renew-package-card__campaign">
          <img src={Campain} alt="" aria-hidden="true" />
          تخفیف ویژه 
        </span>

        <div className="quick-renew-package-card__featured-header">
          <span className="quick-renew-package-card__featured-icon" aria-hidden="true">
            <CrownOutlined />
          </span>
          <div>
            <h2>{formatNumber(plan.name)}</h2>
            <p>{plan.lable || plan.description}</p>
          </div>
        </div>

        <div className="quick-renew-package-card__featured-content">
          <ul className="quick-renew-package-card__features">
            {features.map((feature) => (
              <li key={feature}>
                <CheckOutlined />
                <span>{formatNumber(feature)}</span>
              </li>
            ))}
          </ul>

          <div className="quick-renew-package-card__price-block">
            {!!plan.basePrice && plan.basePrice !== plan.salesPrice && (
              <div className="quick-renew-package-card__old-price">
                <span>{discount}٪</span>
                <del>{formatPrice(plan.basePrice)} تومان</del>
              </div>
            )}
            <strong>
              {plan.salesPrice === 0 ? "رایگان" : formatPrice(plan.salesPrice)}
              {plan.salesPrice !== 0 && <small>تومان</small>}
            </strong>
          </div>
        </div>

        <div className="quick-renew-package-card__featured-footer">
          <button
            type="button"
            className="quick-renew-package-card__details"
            onClick={() => onShowDetails(plan)}
          >
            جزئیات بسته
          </button>

          <Button
            className="buttons-styles quick-renew-package-card__select--filled"
            size="large"
            loading={isLoading}
            onClick={() => onSelect(plan)}
          >
            انتخاب بسته
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`quick-renew-package-card quick-renew-package-card--standard ${
        isPopular && !isRecommended ? "quick-renew-package-card--popular" : ""
      } ${isRecommended ? "quick-renew-package-card--landing-recommended" : ""} ${
        isFreeTrial ? "quick-renew-package-card--landing-free-trial" : ""
      }`}
    >
      <span
        className={`quick-renew-package-card__badge ${
          isRecommended
            ? "quick-renew-package-card__badge--landing-recommended"
            : isFreeTrial
              ? "quick-renew-package-card__badge--landing-free-trial"
              : isPopular
            ? "quick-renew-package-card__badge--popular"
            : isNormalUser
              ? "quick-renew-package-card__badge--normal"
              : "quick-renew-package-card__badge--heavy"
        }`}
      >
        {badgeText}
      </span>

      <div className="quick-renew-package-card__icon" aria-hidden="true">
        <PackageIcon plan={plan} />
      </div>
      <h3>{formatNumber(plan.name)}</h3>
      <p className="quick-renew-package-card__subtitle">{plan.lable || plan.description}</p>

      <ul className="quick-renew-package-card__features quick-renew-package-card__features--standard">
        {features.map((feature) => (
          <li key={feature}>{formatNumber(feature)}</li>
        ))}
      </ul>

      <div className="quick-renew-package-card__standard-price">
        {!!plan.basePrice && plan.basePrice !== plan.salesPrice && (
          <del>{formatPrice(plan.basePrice)} تومان</del>
        )}
        <strong>
          {plan.salesPrice === 0 ? "رایگان" : formatPrice(plan.salesPrice)}
          {plan.salesPrice !== 0 && <small>تومان</small>}
        </strong>
        {!!plan.discountPercent && (
          <p>
            <span style={{color:"#FF0000",paddingLeft:"5px"}}>{discount}٪</span>
            <span className="quick-renew-package-card__discount-label">
              تخفیف به مدت محدود
            </span>
          </p>
        )}
      </div>

      <button
        type="button"
        className="quick-renew-package-card__details"
        onClick={() => onShowDetails(plan)}
      >
        جزئیات بسته
      </button>

      <Button
        className={`quick-renew-package-card__select ${
          isRecommended ? "quick-renew-package-card__select--landing-recommended" : ""
        }`}
        loading={isLoading}
        onClick={() => onSelect(plan)}
      >
        <span className="quick-renew-package-card__select-desktop">انتخاب بسته</span>
        <span className="quick-renew-package-card__select-mobile">فعالسازی</span>
      </Button>
    </article>
  );
}
