import type { RouteObject } from "react-router";
import MainLayout from "@/core/layouts/MainLayout";
import BIActivationGuideView from "./components/biActivationGuide";
import BIPlans from "./views/BIPlans";

export const BIRoutes: RouteObject[] = [
    {
        path: "/",
        Component: MainLayout,
        children: [

            {
                path: "/plans/BI",
                Component: BIPlans,
            },
              {
                path: "/BI-guide",
                Component: BIActivationGuideView,
            },
        ],
    },
];
