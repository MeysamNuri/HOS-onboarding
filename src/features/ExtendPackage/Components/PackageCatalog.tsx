import { Select } from "antd";
import { useState } from "react";
import {
  AppstoreOutlined,
  DownOutlined,
  TableOutlined,
} from "@ant-design/icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

import filterIcon from "@core/assets/icons/filter_list.svg";
import BottomModal from "@/core/components/customModal";
import type { IServicePacketOBG } from "@/core/types/models";

import PackageTable from "./PackageTable";
import QuickRenewPackageCard from "./QuickRenewPackageCard";
import usePackageCatalog, {
  type AudienceFilter,
  type DurationFilter,
} from "../Hooks/usePackageCatalog";
import { isSamePlan } from "../utils/packageUtils";

import "../views/styles.scss";
import "./packageFilters.scss";

interface PackageCatalogProps {
  plans: IServicePacketOBG[];
  excludedPlan?: IServicePacketOBG;
  recommendedPlan?: IServicePacketOBG;
  freeTrialPlan?: IServicePacketOBG;
  selectedPlan?: IServicePacketOBG;
  activationLoading?: boolean;
  mobileInitialVisibleCount?: number;
  desktopInitialVisibleCount?: number;
  enableMobileFilterModal?: boolean;
  heading?: string;
  onSelect: (plan: IServicePacketOBG) => void;
  onShowDetails: (plan: IServicePacketOBG) => void;
}

export default function PackageCatalog({
  plans,
  excludedPlan,
  recommendedPlan,
  freeTrialPlan,
  selectedPlan,
  activationLoading = false,
  mobileInitialVisibleCount,
  desktopInitialVisibleCount,
  enableMobileFilterModal = false,
  heading,
  onSelect,
  onShowDetails,
}: PackageCatalogProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [draftAudienceFilter, setDraftAudienceFilter] =
    useState<AudienceFilter>("all");
  const [draftDurationFilter, setDraftDurationFilter] =
    useState<DurationFilter>("all");
  const {
    audienceFilter,
    durationFilter,
    filteredPlans,
    initialVisibleCount,
    isDesktop,
    popularPlan,
    showAllPackages,
    viewMode,
    visiblePlans,
    setAudienceFilter,
    setDurationFilter,
    setViewMode,
    toggleShowAllPackages,
  } = usePackageCatalog({
    plans,
    excludedPlan,
    mobileInitialVisibleCount,
    desktopInitialVisibleCount,
  });

  const openMobileFilter = () => {
    setDraftAudienceFilter(audienceFilter);
    setDraftDurationFilter(durationFilter);
    setIsMobileFilterOpen(true);
  };

  const applyMobileFilter = () => {
    setAudienceFilter(draftAudienceFilter);
    setDurationFilter(draftDurationFilter);
    setIsMobileFilterOpen(false);
  };

  const clearMobileFilter = () => {
    setDraftAudienceFilter("all");
    setDraftDurationFilter("all");
  };

  return (
    <section
      className={`quick-renew__packages-section${enableMobileFilterModal
          ? " quick-renew__packages-section--mobile-filter"
          : ""
        }`}
    >
      <div className="quick-renew__toolbar">
        <div className="quick-renew__audience-filter">
          <span>نوع مصرف</span>
          <div>
            <button
              type="button"
              className={audienceFilter === "all" ? "is-active" : ""}
              onClick={() => setAudienceFilter("all")}
            >
              همه کاربران
            </button>
            <button
              type="button"
              className={audienceFilter === "normal" ? "is-active" : ""}
              onClick={() => setAudienceFilter("normal")}
            >
              عادی
            </button>
            <button
              type="button"
              className={audienceFilter === "heavy" ? "is-active" : ""}
              onClick={() => setAudienceFilter("heavy")}
            >
              پرمصرف
            </button>
          </div>
        </div>

        <Select
          className="quick-renew__sort"
          value={durationFilter}
          prefix={<TimerOutlinedIcon className="quick-renew__sort-timer" />}
          suffixIcon={<ArrowDropDownIcon className="quick-renew__sort-arrow" />}
          onChange={(value: DurationFilter) => setDurationFilter(value)}
          options={[
            { value: "all", label: "مدت: همه مدت‌ها" },
            { value: "one-month", label: "مدت: یک ماهه" },
            { value: "three-month", label: "مدت: سه ماهه" },
          ]}
        />

        {isDesktop && (
          <div className="quick-renew__view-switch" role="group" aria-label="نوع نمایش">
            <button
              type="button"
              className={viewMode === "cards" ? "is-active" : ""}
              onClick={() => setViewMode("cards")}
            >
              <AppstoreOutlined />
              نمایش کارتی
            </button>
            <button
              type="button"
              className={viewMode === "table" ? "is-active" : ""}
              onClick={() => setViewMode("table")}
            >
              <TableOutlined />
              نمایش جدولی
            </button>
          </div>
        )}

        {enableMobileFilterModal && (
          <button
            type="button"
            className="quick-renew__mobile-filter-button"
            aria-expanded={isMobileFilterOpen}
            onClick={openMobileFilter}
          >
            <img src={filterIcon} alt="" aria-hidden="true" />
            <span>فیلتر</span>
            <DownOutlined />
          </button>
        )}
      </div>

      {heading && (
        <div className="quick-renew__packages-heading">
          <h2>{heading}</h2>
          {initialVisibleCount &&
            filteredPlans.length > initialVisibleCount && (
              <button
                type="button"
                className={`quick-renew__show-more ${showAllPackages ? "quick-renew__show-more--open" : ""
                  }`}
                onClick={toggleShowAllPackages}
              >
                {showAllPackages ? "مشاهده کمتر" : "مشاهده بیشتر"}
                <DownOutlined />
              </button>
            )}
        </div>
      )}

      {viewMode === "cards" || !isDesktop ? (
        <div className="quick-renew__packages-grid">
          {visiblePlans.map((plan) => (
            <QuickRenewPackageCard
              key={`${plan.serviceId}-${plan.code}`}
              plan={plan}
              isPopular={isSamePlan(plan, recommendedPlan ?? popularPlan)}
              isRecommended={Boolean(recommendedPlan && isSamePlan(plan, recommendedPlan))}
              isFreeTrial={Boolean(freeTrialPlan && isSamePlan(plan, freeTrialPlan))}
              selectedPlan={selectedPlan}
              activationLoading={activationLoading}
              onSelect={onSelect}
              onShowDetails={onShowDetails}
            />
          ))}
        </div>
      ) : (
        <PackageTable
          plans={visiblePlans}
          popularPlan={recommendedPlan ?? popularPlan}
          selectedPlan={selectedPlan}
          activationLoading={activationLoading}
          onSelect={onSelect}
          onShowDetails={onShowDetails}
        />
      )}

      {enableMobileFilterModal && (
        <BottomModal
          fitContent
          open={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        >
          <div className="landing-package-filter">
            <div className="landing-package-filter__header">
              <h2>فیلترها</h2>
              <button type="button" onClick={clearMobileFilter}>
                حذف فیلتر
              </button>
            </div>

            <div className="landing-package-filter__section">
              <strong>نوع مصرف</strong>
              <div className="landing-package-filter__options">
                {([
                  ["all", "همه کاربران"],
                  ["normal", "عادی"],
                  ["heavy", "پرمصرف"],
                ] as const).map(([value, label]) => (
                  <button
                    type="button"
                    className={draftAudienceFilter === value ? "is-active" : ""}
                    key={value}
                    onClick={() => setDraftAudienceFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="landing-package-filter__section">
              <strong>مدت دسترسی</strong>
              <div className="landing-package-filter__options">
                {([
                  ["all", "همه مدت‌ها"],
                  ["one-month", "یک ماهه"],
                  ["three-month", "سه ماهه"],
                ] as const).map(([value, label]) => (
                  <button
                    type="button"
                    className={draftDurationFilter === value ? "is-active" : ""}
                    key={value}
                    onClick={() => setDraftDurationFilter(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="landing-package-filter__actions">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                انصراف
              </button>
              <button type="button" onClick={applyMobileFilter}>
                اعمال فیلتر
              </button>
            </div>
          </div>
        </BottomModal>
      )}
    </section>
  );
}
