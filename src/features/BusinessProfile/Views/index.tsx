import { Link } from "react-router";
import { Alert, Button, Spin } from "antd";
import { RiseOutlined, TrophyFilled, LeftOutlined } from "@ant-design/icons";
import logo from "@/core/assets/images/landing/logo.svg";
import useBusinessProfile from "../Hooks/useBusinessProfile";
import ProfileImage from "../Components/ProfileImage";
import { phoneHref, safeWebUrl } from "../helper/links";
import shop from "../assets/shop.png";
import instagram from "../assets/instagram.png";
import telegram from "../assets/telegram.png";
import whatsapp from "../assets/whatsapp.png";
import bale from "../assets/bale.png";
import rubika from "../assets/rubika.png";
import "./styles.scss";

const socialPlatforms = {
  instagram: { label: "اینستاگرام", image: instagram },
  telegram: { label: "تلگرام", image: telegram },
  whatsapp: { label: "واتساپ", image: whatsapp },
  bale: { label: "بله", image: bale },
  rubika: { label: "روبیکا", image: rubika },
};

export default function BusinessProfile() {
  const { business, error, isFetching, notFound, retry } = useBusinessProfile();
  if (notFound)
    return (
      <main className="business-profile business-profile__state" dir="rtl">
        <h1>کسب‌وکار پیدا نشد</h1>
        <p>آدرس واردشده را بررسی کنید.</p>
        <Link to="/home">بازگشت به خانه</Link>
      </main>
    );
  if (isFetching && !business)
    return (
      <main
        className="business-profile business-profile__state"
        aria-busy="true"
        aria-label="در حال دریافت اطلاعات کسب‌وکار"
      >
        <Spin size="large" />
        <p role="status">در حال دریافت اطلاعات کسب‌وکار…</p>
      </main>
    );
  if (error || !business)
    return (
      <main className="business-profile business-profile__state" dir="rtl">
        <Alert
          type="error"
          showIcon
          message="دریافت اطلاعات کسب‌وکار ناموفق بود"
        />
        <Button onClick={() => void retry()}>تلاش مجدد</Button>
      </main>
    );

  const website = safeWebUrl(business.website);
  const bannerLink = safeWebUrl(business.banner?.link);
  const mapLink = safeWebUrl(business.map?.link);
  const socialLinks = (business.socialLinks ?? []).filter(
    (social) =>
      Object.hasOwn(socialPlatforms, social.platform) && safeWebUrl(social.url),
  );
  const banner = business.banner && (
    <ProfileImage
      src={business.banner.imageUrl}
      alt={business.banner.alt}
      eager
    />
  );

  return (
    <div className="business-profile" dir="rtl">
      <header className="business-profile__header business-profile__container">
        <a href="#business-introduction" className="business-profile__brand">
          <span className="business-profile__avatar">
            {safeWebUrl(business.logoUrl) ? (
              <ProfileImage src={business.logoUrl} alt="" eager />
            ) : (
              business.name.trim().charAt(0)
            )}
          </span>
          <span>{business.name}</span>
        </a>
        <span>معرفی کسب‌وکار</span>
      </header>
      <main>
        <section className="business-profile__hero">
          <div className="business-profile__container business-profile__hero-inner">
            <div>
              <h1>{business.name}</h1>
              {business.tagline && <p>{business.tagline}</p>}
            </div>
            {business.banner &&
              (bannerLink ? (
                <a
                  className="business-profile__banner"
                  href={bannerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {banner}
                </a>
              ) : (
                <div className="business-profile__banner">{banner}</div>
              ))}
          </div>
        </section>
        <div className="business-profile__container">
          <section
            id="business-introduction"
            className="business-profile__introduction"
          >
            <div>
              <h2>معرفی فروشگاه</h2>
              <p>{business.introduction}</p>
            </div>
            <ProfileImage
              src={business.introductionImageUrl}
              fallback={shop}
              alt="معرفی فروشگاه"
            />
          </section>
          <div className="business-profile__stories">
            {business.productsDescription && (
              <section className="business-profile__card business-profile__card--products">
                <div className="business-profile__decoration">
                  <span>
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M17 2 30 9v16l-13 7L4 25V9L17 2Zm0 14 13-7M17 16 4 9m13 7v16M10 5l13 7" />
                    </svg>
                  </span>
                  <i />
                </div>
                <h2>ویترین محصولات</h2>
                <p>{business.productsDescription}</p>
              </section>
            )}
            {business.successStory && (
              <section className="business-profile__card">
                <div className="business-profile__decoration business-profile__decoration--success">
                  <span>
                    <RiseOutlined />
                  </span>
                  <svg
                    viewBox="0 0 400 40"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M0 20 Q50 0 100 20 T200 20 T300 20 T400 20" />
                  </svg>
                  <TrophyFilled />
                </div>
                <h2>داستان موفقیت</h2>
                <p>{business.successStory}</p>
              </section>
            )}
          </div>
        </div>
        <section className="business-profile__contact">
          <div className="business-profile__container">
            <h2>تماس و آدرس</h2>
            <div className="business-profile__contact-grid">
              <div className="business-profile__contact-details">
                <h3>با ما تماس بگیرید</h3>
                <div className="business-profile__phones">
                  {(business.phones ?? []).map((phone) => (
                    <a key={phone} href={phoneHref(phone)}>
                      <bdi dir="ltr">{phone}</bdi>
                    </a>
                  ))}
                </div>
                {business.address && (
                  <>
                    <h4>نشانی فروشگاه</h4>
                    <address>{business.address}</address>
                  </>
                )}
                {website && (
                  <>
                    <h4>وبسایت فروشگاه</h4>
                    <a
                      className="business-profile__website"
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <bdi>{new URL(website).hostname}</bdi>
                    </a>
                  </>
                )}
              </div>
              {business.map && (
                <div className="business-profile__map">
                  {mapLink ? (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="نمایش موقعیت فروشگاه روی نقشه"
                    >
                      <ProfileImage
                        src={business.map.imageUrl}
                        alt={"موقعیت " + business.name}
                      />
                    </a>
                  ) : (
                    <ProfileImage
                      src={business.map.imageUrl}
                      alt={"موقعیت " + business.name}
                    />
                  )}
                </div>
              )}
            </div>
            {socialLinks.length > 0 && (
              <nav
                className="business-profile__socials"
                aria-label="شبکه‌های اجتماعی"
              >
                <h3>شبکه‌های اجتماعی</h3>
                <div>
                  {socialLinks.map(({ platform, url }) => {
                    const { image, label } = socialPlatforms[platform];
                    return (
                      <a
                        key={platform}
                        href={safeWebUrl(url)}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={image} alt="" />
                      </a>
                    );
                  })}
                </div>
              </nav>
            )}
          </div>
        </section>
      </main>
      <footer className="business-profile__footer">
        <div className="business-profile__container">
          <div className="business-profile__powered">
            <img src={logo} alt="هلو" />
            <div>
              <h3>ارائه‌شده با خدمات هلو</h3>
              <p>ارسال فاکتور و گزارش معین برای مشتریان، ساده‌تر از همیشه</p>
            </div>
          </div>
          <Link to="/holoo-landing">
            با خدمات هلو بیشتر آشنا شوید <LeftOutlined />
          </Link>
        </div>
      </footer>
    </div>
  );
}
