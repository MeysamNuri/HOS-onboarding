import { Grid } from "antd";
import { useMemo, useState } from "react";

import type { IServicePacketOBG } from "@/core/types/models";

import { getDurationInMonths, isSamePlan } from "../utils/packageUtils";

export type AudienceFilter = "all" | "normal" | "heavy";
export type DurationFilter = "all" | "one-month" | "three-month";
export type ViewMode = "cards" | "table";

interface UsePackageCatalogOptions {
  plans: IServicePacketOBG[];
  excludedPlan?: IServicePacketOBG;
  mobileInitialVisibleCount?: number;
  desktopInitialVisibleCount?: number;
  initialViewMode?: ViewMode;
}

export default function usePackageCatalog({
  plans,
  excludedPlan,
  mobileInitialVisibleCount,
  desktopInitialVisibleCount,
  initialViewMode = "cards",
}: UsePackageCatalogOptions) {
  const screens = Grid.useBreakpoint();
  const isDesktop = Boolean(screens.lg);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>("all");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const popularPlan = useMemo(
    () =>
      plans.find((plan) =>
        [plan.name, plan.lable].some((value) => value?.trim().includes("الماس")),
      ),
    [plans],
  );

  const filteredPlans = useMemo(() => {
    const availablePlans = excludedPlan
      ? plans.filter((plan) => !isSamePlan(plan, excludedPlan))
      : plans;

    return availablePlans.filter((plan) => {
      const matchesAudience =
        audienceFilter === "all" ||
        (audienceFilter === "normal" && plan.type === "Normal") ||
        (audienceFilter === "heavy" && plan.type !== "Normal");

      if (!matchesAudience) return false;

      const durationInMonths = getDurationInMonths(plan.duration);
      if (durationFilter === "one-month") return durationInMonths === 1;
      if (durationFilter === "three-month") return durationInMonths === 3;

      return true;
    });
  }, [audienceFilter, durationFilter, excludedPlan, plans]);

  const initialVisibleCount = isDesktop
    ? desktopInitialVisibleCount
    : mobileInitialVisibleCount;
  const visiblePlans =
    initialVisibleCount && !showAllPackages
      ? filteredPlans.slice(0, initialVisibleCount)
      : filteredPlans;

  return {
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
    toggleShowAllPackages: () => setShowAllPackages((currentValue) => !currentValue),
  };
}
