import type { IResponse } from '@/core/types/responseModel';
import { baseApi } from '../../../core/api/baseApi';
import type {
  
    IGetSendInvoiceRes,
} from '../types';


export const onlineExtraValuesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getSampleInvoice: builder.mutation<IResponse<IGetSendInvoiceRes>, void>(
            {
                query: () => ({
                    url: "SampleInvoice/SendSampleInvoice",
                    method: "GET",

                }),
            }
        ),
   
   
    }),
});


export const {
    useGetSampleInvoiceMutation
     } = onlineExtraValuesApi;
