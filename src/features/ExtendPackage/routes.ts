import type { RouteObject } from "react-router";
import ExtendPackage from "./views";
import MainLayout from "@/core/layouts/MainLayout";

export const ExtendPackageRoutes: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "quickrenew",
        Component: ExtendPackage  ,
      },
   
    ],
  },
];
