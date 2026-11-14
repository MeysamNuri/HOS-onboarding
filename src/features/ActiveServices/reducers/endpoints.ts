// ordersApi.ts
import type { IResponse } from '@/core/types/responseModel';
import { baseApi } from '../../../core/api/baseApi';
import type { IActiveServicesRes,IActiveServicesPayload} from '../types';

export const ActiveServicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   getActiveServices: builder.query<IResponse<IActiveServicesRes>, IActiveServicesPayload>(
            {
                query: ({ serial }) => ({
                    url: "User/GetSerialActiveServices",
                    method: "GET",
                   params: serial ? { serial } : undefined,
                }),
            }
        ),
  }),
});

export const { useGetActiveServicesQuery } = ActiveServicesApi;