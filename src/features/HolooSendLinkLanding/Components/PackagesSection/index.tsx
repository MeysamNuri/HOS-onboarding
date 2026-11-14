import Check from "@core/assets/images/landing/extracted/check.png";
import agentProfile from "@core/assets/images/agent-profile.svg";
import PackageCatalog from "@/features/ExtendPackage/Components/PackageCatalog";
import type { IServicePacketOBG } from "@/core/types/models";
import { NumberConverter } from "@/core/helper/numberConverter";

import "./styles.scss";

interface PackagesSectionProps {
  agentCode?: string;
  agentName?: string;
  isAgentDiscountEnabled?: boolean;
  plans: IServicePacketOBG[];
  selectedPlan?: IServicePacketOBG;
  activationLoading: boolean;
  onSelectPlan: (plan: IServicePacketOBG) => void;
  onShowPlanDetails: (plan: IServicePacketOBG) => void;
  onAgentDiscountChange?: (enabled: boolean) => void;
}

export default function PackagesSection({
  agentCode,
  agentName,
  isAgentDiscountEnabled = false,
  plans,
  selectedPlan,
  activationLoading,
  onSelectPlan,
  onShowPlanDetails,
  onAgentDiscountChange,
}: PackagesSectionProps) {
  const recommendedPlan = plans.find((plan) =>
    plan.code?.toLowerCase() === "pro" || plan.name?.includes("حرفه"),
  );
  const freeTrialPlan = plans.find((plan) =>
    ["start", "simple"].includes(plan.code?.toLowerCase()) ||
    plan.name?.includes("آغاز") ||
    plan.salesPrice === 0,
  );

  return (
    <section className="holoo-landing-packages" id="landing-packages">
      <div className="holoo-landing-packages__inner">
        <header className="holoo-landing-packages__heading">
          <h2>بسته‌ها را در یک نگاه مقایسه کنید</h2>
          <p>مدت دسترسی و ظرفیت ارتباط را متناسب با نیاز کسب‌وکارتان انتخاب کنید.</p>
        </header>

        {agentCode && (
          <div className="holoo-landing-packages__agent-offer">
            <div className="holoo-landing-packages__agent-identity">
              <span className="holoo-landing-packages__agent-discount-badge">
                ۱۵٪
              </span>
              <span className="holoo-landing-packages__agent-name">
                نمایندگی {agentName || "-"}
              </span>
              <span className="holoo-landing-packages__agent-code">
                کد: {NumberConverter.latinToArabic(agentCode)}
              </span>
              <img src={agentProfile} alt="" aria-hidden="true" />
            </div>

            <div className="holoo-landing-packages__agent-discount">
              <span><b>۱۵٪</b> تخفیف بیشتر ویژه نمایندگی</span>
              <button
                type="button"
                role="switch"
                aria-label="فعال‌سازی تخفیف نمایندگی"
                aria-checked={isAgentDiscountEnabled}
                className={`holoo-landing-packages__agent-toggle${
                  isAgentDiscountEnabled
                    ? " holoo-landing-packages__agent-toggle--active"
                    : ""
                }`}
                onClick={() => onAgentDiscountChange?.(!isAgentDiscountEnabled)}
              >
                <i />
              </button>
            </div>
          </div>
        )}

        <div className="quick-renew holoo-landing-packages__catalog">
          <PackageCatalog
            enableMobileFilterModal
            plans={plans}
            recommendedPlan={recommendedPlan}
            freeTrialPlan={freeTrialPlan}
            selectedPlan={selectedPlan}
            activationLoading={activationLoading}
            onSelect={onSelectPlan}
            onShowDetails={onShowPlanDetails}
          />
        </div>

        <div className="holoo-landing-packages__trust-list">
          <span><img src={Check} width={15}/> پرداخت امن</span>
          <span><img src={Check} width={15}/>  فعال‌سازی سریع</span>
          <span><img src={Check} width={15}/>  بدون قرارداد اجباری</span>
        </div>
      </div>
    </section>
  );
}
