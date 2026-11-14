import type { IResponse } from '@/core/types/responseModel';
import { baseApi } from '../../../core/api/baseApi';
import type {

    IGetdIndividualMoeinSampleRes,
    IGetStatistics
} from '../types';

export const HolooSendLinkLandingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStatistics: builder.query<IResponse<IGetStatistics>, void>(
            {
                query: () => ({
                    url: "Statistics/GetStatistics",
                    method: "GET",
                }),
            }
        ),
          getSendIndividualSample: builder.mutation<IResponse<IGetdIndividualMoeinSampleRes>, void>(
                    {
                        query: () => ({
                            url: "IndividualMoeinSample/SendIndividualMoeinSample",
                            method: "GET",
        
                        }),
                    }
                ),
    }),
});


export const {
    useGetStatisticsQuery,
    useGetSendIndividualSampleMutation
} = HolooSendLinkLandingApi;
