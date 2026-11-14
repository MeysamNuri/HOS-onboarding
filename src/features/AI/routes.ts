import type { RouteObject } from "react-router";

import MainLayout from "@/core/layouts/MainLayout";


export const AIRoutes: RouteObject[] = [
    {
        path: "/",
        Component: MainLayout,
        children: [

            {
                path: "/plans/AI",
            //   Component: OnlineServicesPlans,
            }
        ],
    },
];
