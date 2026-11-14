import type { RouteObject } from "react-router";
import Orders from "./Views";
import MainLayout from "@/core/layouts/MainLayout";

export const OrdersRoutes: RouteObject[] = [
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "orders/history",
        Component: Orders  ,
      },
   
    ],
  },
];
