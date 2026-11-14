// ordersApi.ts
import type { IResponse } from '@/core/types/responseModel';
import { baseApi } from '../../../core/api/baseApi';
import type { ISendLinksRes, IUserSendLinks } from '../types';

export const SendLinksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserMessages: builder.query<IResponse<ISendLinksRes>, IUserSendLinks>({
      query: (params) => {
        // Start with all params
        const requestParams: any = { ...params };
        
        // Remove fromDate and toDate if they are falsy (undefined, null, or empty string)
        if (!requestParams.sendDateFrom) delete requestParams.sendDateFrom;
        if (!requestParams.sendDateTo) delete requestParams.sendDateTo;
        if (!requestParams.reportType) delete requestParams.reportType;
        if (!requestParams.search) delete requestParams.search;
        if (!requestParams.status) delete requestParams.status;
        
        return {
          url: "Messages/GetMessages",
          method: "GET",
          params: requestParams,
        };
      },
    }),
  }),
});

export const { useGetUserMessagesQuery } = SendLinksApi;
