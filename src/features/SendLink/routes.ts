import type { RouteObject } from "react-router";
import Orders from "./Views";
import MainLayout from "@/core/layouts/MainLayout";

export const SentLinksRoutes: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "sent-links",
        Component: Orders  ,
      },
   
    ],
  },
];
