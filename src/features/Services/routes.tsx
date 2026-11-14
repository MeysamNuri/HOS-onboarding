import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import MainLayout from "@/core/layouts/MainLayout";
import SendInvoiceGuide from "./components/sendInvoiceGuide";
import Settings from "./components/settings";
import OnlineServicesPlans from "./views/onlineServicesPlans";

export const SendInvoiceRoutes: RouteObject[] = [
    {
        path: "/",
        Component: MainLayout,
        children: [

            {
                path: "/sendLink",
                Component: OnlineServicesPlans,
            },
            {
                path: "/plans/SendInvoice/sendInvoice-guide",
                element: <Navigate to="/sendLink-help" replace />,
            },
            {
                path: "/sendLink-help",
                Component: SendInvoiceGuide,
            },

            {
                path: "/settings",
                Component: Settings,
            },
        ],
    },
];
