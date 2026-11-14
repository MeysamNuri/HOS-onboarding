import type { RouteObject } from "react-router";
import Support from "./Views";
import MainLayout from "@/core/layouts/MainLayout";

export const SupportsRoutes: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "support",
        Component: Support  ,
      },{
        path: "hos",
        Component: Support,
      },
   
    ],
  },
];
