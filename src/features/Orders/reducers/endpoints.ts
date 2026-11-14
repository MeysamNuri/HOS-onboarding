// ordersApi.ts
import type { IResponse } from '@/core/types/responseModel';
import { baseApi } from '../../../core/api/baseApi';
import type { IUserOrderHitoryRes, IUserOrders } from '../types';

export const OrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query<IResponse<IUserOrderHitoryRes>, IUserOrders>({
      query: (params) => {
        // Start with all params
        const requestParams: any = { ...params };
        
        // Remove fromDate and toDate if they are falsy (undefined, null, or empty string)
        if (!requestParams.fromDate) delete requestParams.fromDate;
        if (!requestParams.toDate) delete requestParams.toDate;
        if (!requestParams.serviceType) delete requestParams.serviceType;
        if (!requestParams.serviceStatus) delete requestParams.serviceStatus;
        
        return {
          url: "User/GetSerialServicesHistory",
          method: "GET",
          params: requestParams,
        };
      },
    }),
  }),
});

export const { useGetUserOrdersQuery } = OrdersApi;