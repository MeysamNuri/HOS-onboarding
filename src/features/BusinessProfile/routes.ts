import type { RouteObject } from "react-router";
import BusinessProfile from "./Views";

export const BusinessProfileRoutes: RouteObject[] = [
  { path: "/business/:slug", Component: BusinessProfile },
];
