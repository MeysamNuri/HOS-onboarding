
import { useRoutes } from "react-router";
import NotFound from "./core/components/NotFound";
import { HomePageRoutes } from "./features/HomePage/routes";
import { Navigate } from "react-router";
import { SendInvoiceRoutes } from "./features/Services/routes";
import { BIRoutes } from "./features/BI/routes";
import { AIRoutes } from "./features/AI/routes";
import { OrdersRoutes } from "./features/Orders/routes";
import { ActiveServicesRoutes } from "./features/ActiveServices/routes";
import { SentLinksRoutes } from "./features/SendLink/routes";
import { SupportsRoutes } from "./features/Support/routes";
import { ExtendPackageRoutes } from "./features/ExtendPackage/routes";
import { HolooSendLinkLandingRoutes } from "./features/HolooSendLinkLanding/routes";
import { HolooHamrahRoutes } from "./features/HolooHamrahLanding/routes";
import { BusinessProfileRoutes } from "./features/BusinessProfile/routes";


export const appRoutes = [
  { path: "/", element: <Navigate to="/holoo-sendLink-landing" replace /> },
  ...SendInvoiceRoutes,
  ...BIRoutes,
  ...AIRoutes,
  ...HomePageRoutes,
  ...OrdersRoutes,
  ...ActiveServicesRoutes,
  ...SentLinksRoutes,
  ...SupportsRoutes,
  ...ExtendPackageRoutes,
  ...HolooSendLinkLandingRoutes,
  ...HolooHamrahRoutes,
  ...BusinessProfileRoutes,
  { path: "*", element: <NotFound /> },
];

export const AppRouter = () => {
  const element = useRoutes(appRoutes);
  return element;
};
