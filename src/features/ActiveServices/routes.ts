import type { RouteObject } from "react-router";
import ActiveServices from "./Views/inex";
import MainLayout from "@/core/layouts/MainLayout";

export const ActiveServicesRoutes: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "active-services",
        Component: ActiveServices  ,
      },
   
    ],
  },
];
