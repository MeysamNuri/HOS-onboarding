import { useLocation } from "react-router";
import { getRenewalCampaignUrl } from "@/core/helper/renewalCampaign";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import BottomModal from "@/core/components/customModal";
import OrderDetailsError from "@/features/Services/components/orderDetailsError";
import PackagesDetailsModal from "@/core/components/packagesDetailsModal";
import ChooseSerialModal from "@/core/components/chooseSerialModal";
import mobileProposalBannerOne from "@core/assets/images/banner-propose/mobile/Banner1.png";
import mobileProposalBannerFour from "@core/assets/images/banner-propose/mobile/banner3-3.png";

import CompanionSection from "../Components/CompanionSection";
// import ConsultationSection from "../Components/ConsultationSection";
import HeroSection from "../Components/HeroSection";
import LandingHeader from "../Components/LandingHeader";
import LandingFooter from "../Components/LandingFooter";
import PackagesSection from "../Components/PackagesSection";
import StatisticsSection from "../Components/StatisticsSection";
import SuccessStoriesSection from "../Components/SuccessStoriesSection";
import SupportSection from "../Components/SupportSection";
import WhySection from "../Components/WhySection";
import useHolooSendLinkLanding from "../Hooks/useHolooSendLinkLanding";
import useLandingPackages from "../Hooks/useLandingPackages";
import InvoiceDemoModal from "@/features/Services/components/invoiceDemoModal";
import SampleSelectionModal from "../Components/SampleSelectionModal";
import SubscriptionInfo from "@/features/Services/components/subscriptionInfo";
import usePersonalCallbackURL from "@/features/Services/hooks/personalCallBack";

import "./styles.scss";
import { useGetStatisticsQuery } from "../reducers/endpoints";

const landingProposalBanners = [
  mobileProposalBannerOne,
  mobileProposalBannerFour,
];
const baleChannelUrl = "https://portfolio.invalid/HolooOnlineC";

export default function HolooSendLinkLanding() {
  const { pathname } = useLocation();
  const renewalCampaignUrl = getRenewalCampaignUrl(pathname);
  const { data: statisticsResponse, isLoading: statisticsLoading, isError: statisticsError, refetch: refetchStatistics } = useGetStatisticsQuery();
  const statistics = statisticsResponse?.Status ? statisticsResponse.Data : undefined;
  const {
    isMobileMenuOpen,
    navigationItems,
    handleCloseInvoiceDemo,
    handleLogin,
    handleLogout,
    isLogin,
    userName,
    handleManagePackages,
    handleNavigation,
    handleSendSample,
    handleSelectSample,
    openSampleSelection,
    closeSampleSelection,
    openInvoiceDemo,
    sampleType,
    toggleMobileMenu,
  } = useHolooSendLinkLanding();
  const {
    activationLoading,
    agentCode,
    agentName,
    handleCloseModal,
    handleClosePackageDetail,
    handleFreeActivation,
    handleSelectPlan,
    handleShowPlanDetails,
    isAgentDiscountEnabled,
    openPackageDetailModal,
    openPlansModal,
    plans,
    selectedPlan,
    setIsAgentDiscountEnabled,
    handleSubmit,
    isSubmitting,
    errorResult,
    closeError,
  } = useLandingPackages();
  const {
    errorModal,
    handleCloseError,
    handleCloseGuranteeModal,
    limittedOrderResponse,
    orderResponse,
    postLoading,
    showErrors,
    showGuaranteeExpireModal,
  } = usePersonalCallbackURL();

  if (postLoading) return <AjaxLoadingComponent />;

  return (
    <div className="holoo-landing-page">
      <LandingHeader
        navigationItems={navigationItems}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
        onNavigation={handleNavigation}
        onManagePackages={handleManagePackages}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLogin={isLogin}
        userName={userName}
      />
      <HeroSection
        onFreeActivation={handleFreeActivation}
        onSendSample={handleSendSample}
      />
      <StatisticsSection statistics={statistics} isLoading={statisticsLoading} />
      {(statisticsError || statisticsResponse?.Status === false) && (
        <div role="status">
          دریافت آمار با خطا مواجه شد.
          <button type="button" onClick={() => refetchStatistics()}>تلاش مجدد</button>
        </div>
      )}
      <PackagesSection
        agentCode={agentCode}
        agentName={agentName}
        isAgentDiscountEnabled={isAgentDiscountEnabled}
        onAgentDiscountChange={setIsAgentDiscountEnabled}
        plans={plans}
        selectedPlan={selectedPlan}
        activationLoading={activationLoading}
        onSelectPlan={handleSelectPlan}
        onShowPlanDetails={handleShowPlanDetails}
      />
      <div className="landing-proposal-banners">
        {landingProposalBanners.map((banner, index) =>
          index === 0 ? (
            <a
              key={banner}
              className="landing-proposal-banners__link landing-proposal-banners__link--channel"
              href={baleChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="landing-proposal-banners__image"
                src={banner}
                alt="پیوستن به کانال بله هلو آنلاین"
              />
            </a>
          ) : (
            <a key={banner} className="landing-proposal-banners__link landing-proposal-banners__link--campaign" href={renewalCampaignUrl}>
                <img className="landing-proposal-banners__image" src={banner} alt="تخفیف تمدید بسته" />
              </a>
          ),
        )}
      </div>
      <WhySection />
      <SuccessStoriesSection consumers={statistics?.topConsumers ?? []} />
      <CompanionSection companions={statistics?.newCompanions ?? []} />
      <SupportSection
        onFreeActivation={handleFreeActivation}
        onOpenGuide={() => handleNavigation("/sendLink-help")}
      />
      {/* <ConsultationSection /> */}
      <LandingFooter />

      <BottomModal open={openPlansModal} onClose={handleCloseModal} fitContent>
        <ChooseSerialModal onCancel={handleCloseModal} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </BottomModal>
      <BottomModal open={Boolean(errorResult)} onClose={closeError} showHandler={false} height="100vh">
        <OrderDetailsError
          onClose={closeError}
          messages={errorResult?.messages}
          orderDetailsData={errorResult?.orderDetails}
          selectedPlan={errorResult?.selectedPlan}
          serviceCode={errorResult?.serviceCode}
        />
      </BottomModal>
      <BottomModal open={openPackageDetailModal} onClose={handleClosePackageDetail}>
        <PackagesDetailsModal />
      </BottomModal>
      <BottomModal open={openInvoiceDemo} onClose={handleCloseInvoiceDemo} fitContent>
        <InvoiceDemoModal onCancel={handleCloseInvoiceDemo} sampleType={sampleType} />
      </BottomModal>
      <SampleSelectionModal open={openSampleSelection} onClose={closeSampleSelection} onSelect={handleSelectSample} />
      <BottomModal open={errorModal} onClose={handleCloseError}>
        <OrderDetailsError
          messages={showErrors}
          onClose={handleCloseError}
          title={limittedOrderResponse || undefined}
          actionLabel="مشاهده بسته ها"
          onAction={() => {
            handleCloseError();
            handleNavigation("/quickrenew?packetcode=OneMonth2000-3&mtm_source=holooSendLinkLanding&mtm_medium=CTA&mtm_campaign=holooSendLinkLanding");
          }}
        />
      </BottomModal>
      <BottomModal open={showGuaranteeExpireModal} onClose={handleCloseGuranteeModal}>
        <SubscriptionInfo
          orderResponse={orderResponse}
          onCancel={handleCloseGuranteeModal}
        />
      </BottomModal>
    </div>
  );
}
