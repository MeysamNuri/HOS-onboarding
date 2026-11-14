import type { RouteObject } from "react-router";
import HomePage from "./views";
import MainLayout from "@/core/layouts/MainLayout";

export const HomePageRoutes: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "/home",
        Component: HomePage  ,
      },
   
   
    ],
  },
];
