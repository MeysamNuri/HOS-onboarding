import { useLocation } from "react-router";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import discountBannerOne from "@core/assets/images/banner-propose/Banner.png";
import discountBannerFour from "@core/assets/images/banner-propose/banner4.png";
import mobileDiscountBannerFour from "@core/assets/images/banner-propose/mobile/banner4.png";
import { getRenewalCampaignUrl } from "@/core/helper/renewalCampaign";

import discountBannerThree from "@core/assets/images/banner-propose/banner3.png";
import mobileDiscountBannerOne from "@core/assets/images/banner-propose/mobile/Banner1.png";

import mobileDiscountBannerThree from "@core/assets/images/banner-propose/mobile/Banner3.png";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import ChooseSerialModal from "@/core/components/chooseSerialModal";
import BottomModal from "@/core/components/customModal";
import Errors from "@/core/components/errorPage";
import PackagesdetailsModal from "@/core/components/packagesDetailsModal";
import PagesHeader from "@/core/components/pagesHeader";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import { NumberConverter } from "@/core/helper/numberConverter";

import PackageCatalog from "../Components/PackageCatalog";
import QuickRenewPackageCard from "../Components/QuickRenewPackageCard";
import useExtendPackageView from "../Hooks/useExtendPackageView";

import "./styles.scss";

const discountBanners = [
  discountBannerOne,
  discountBannerFour,
  discountBannerThree,
];
const mobileDiscountBanners = [
  mobileDiscountBannerOne,
  mobileDiscountBannerFour,
  mobileDiscountBannerThree
];
const baleChannelUrl = "https://portfolio.invalid/HolooOnlineC";

export default function ExtendPackage() {
  const { pathname } = useLocation();
  const renewalCampaignUrl = getRenewalCampaignUrl(pathname);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const visibleDiscountBanners = isMobile
    ? mobileDiscountBanners
    : discountBanners;
  const {
    activationLoading,
    featuredPlan,
    handleCloseModal,
    handleClosePackageDetail,
    handleOpenpackageDetails,
    hanleOpenModal,
    openPackageDetailModal,
    openPlansModal,
    packetDataLoading,
    plans,
    selectedPlan,
    serial,
    userInfo,
    freePackageOrder
  } = useExtendPackageView();

  if (packetDataLoading) return <AjaxLoadingComponent />;

  return (
    <div className="page-container quick-renew">
      <div className="quick-renew__topbar">
        <div className="quick-renew__page-title">
          <PagesHeader title="تمدید سریع بسته" />
        </div>
      </div>

      <section className="quick-renew__summary">
        <div className="quick-renew__account-panel">
          <h2>اطلاعات دستگاه و کاربر</h2>
          <div className="quick-renew__account-card">
            <div>
              <span>شماره موبایل</span>
              <strong>
                {NumberConverter.latinToArabic(
                  convertToDomesticFormat(userInfo?.phoneNumber ?? ""),
                )}
              </strong>
            </div>
            <div>
              <span>سریال</span>
              <strong>{NumberConverter.latinToArabic(serial ?? "-")}</strong>
            </div>
          </div>
          <Swiper
            key={isMobile ? "mobile" : "desktop"}
            className="quick-renew__discount-banner-carousel"
            modules={[Autoplay]}
            slidesPerView={1}
            speed={650}
            loop
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            aria-label="بنرهای پیشنهادی تمدید آسان"
          >
            {visibleDiscountBanners.map((banner, index) => (
              <SwiperSlide key={banner}>
                {index === 0 ? (
                  <a
                    className="quick-renew__discount-banner-link"
                    href={baleChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="quick-renew__discount-banner-image"
                      src={banner}
                      alt="پیوستن به کانال بله هلو آنلاین"
                    />
                  </a>
                ) : index === 1 ? (
                  <a className="quick-renew__discount-banner-link" href={renewalCampaignUrl}>
                    <img className="quick-renew__discount-banner-image" src={banner} alt="تخفیف تمدید بسته" />
                  </a>
                ) : (
                  <img
                    className="quick-renew__discount-banner-image"
                    src={banner}
                    alt={`بنر پیشنهادی ${index + 1}`}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="quick-renew__featured-panel">
          <h2>بسته پیشنهادی</h2>
          {featuredPlan && (
            <QuickRenewPackageCard
              variant="featured"
              plan={featuredPlan}
              selectedPlan={selectedPlan}
              activationLoading={activationLoading}
              onSelect={hanleOpenModal}
              onShowDetails={handleOpenpackageDetails}
            />
          )}
        </div>
      </section>

      <PackageCatalog
        enableMobileFilterModal
        plans={plans}
        excludedPlan={featuredPlan}
        selectedPlan={selectedPlan}
        activationLoading={activationLoading}
        desktopInitialVisibleCount={4}
        heading="سایر بسته‌ها"
        onSelect={hanleOpenModal}
        onShowDetails={handleOpenpackageDetails}
      />

      <BottomModal open={openPlansModal} onClose={handleCloseModal} fitContent>
        <ChooseSerialModal
          onCancel={handleCloseModal}
          onSubmit={
            Number(selectedPlan?.salesPrice) === 0
              ? freePackageOrder.handleSubmit
              : undefined
          }
          isSubmitting={freePackageOrder.isLoading}
        />
      </BottomModal>
      <BottomModal open={openPackageDetailModal} onClose={handleClosePackageDetail}>
        <PackagesdetailsModal />
      </BottomModal>
      <BottomModal
        open={freePackageOrder.errorModal}
        onClose={freePackageOrder.handleCloseError}
      >
        <Errors
          messages={freePackageOrder.errorMessages}
          title={freePackageOrder.errorTitle || undefined}
          onClose={freePackageOrder.handleCloseError}
        />
      </BottomModal>
    </div>
  );
}
