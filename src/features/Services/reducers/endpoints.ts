import type { IResponse } from '@/core/types/responseModel';
import { baseApi } from '../../../core/api/baseApi';
import type {
    IPostOrderRes, IPostOrder, IPaymentData,
    IPaymentDataRes, IGetInvoiceUserSettingRes,
    IGetInvoiceUserSetting, ISuccesRes, IInvoiceUserSettingSubmit,
    IGetOrderRes,
    IGetOrder,
    IGActiveUserSerials
} from '@core/types/models';

export const onlineExtraValuesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        postOrder: builder.mutation<IResponse<IPostOrderRes>, IPostOrder>(
            {
                query: (payload) => ({
                    url: `Order/PostOrder`,
                    method: "POST",
                    body: payload
                }),
            }
        ),
  
      
        paymentData: builder.mutation<IResponse<IPaymentDataRes>, IPaymentData>(
            {
                query: (payload) => ({
                    url: `Payment/SetPaymentData`,
                    method: "POST",
                    body: payload
                }),
            }
        ),
        getInvoiceUserSetting: builder.query<IResponse<IGetInvoiceUserSettingRes>, IGetInvoiceUserSetting>(
            {
                query: ({ serial }) => ({
                    url: "SendInvoiceUserSettings/GetSendInvoiceUserSetting",
                    method: "GET",
                    params: {
                        serial,
                    },
                }),
            }
        ),
        getActiveUserSerials: builder.query<IResponse<IGActiveUserSerials>, void>(
            {
                query: () => ({
                    url: "User/GetUserSerials",
                    method: "GET",
                   
                }),
            }
        ),

        postInvoiceUserSetting: builder.mutation<IResponse<ISuccesRes>, IInvoiceUserSettingSubmit>(
            {
                query: (payload) => ({
                    url: `SendInvoiceUserSettings/PostSendInvoiceUserSetting`,
                    method: "POST",
                    body: payload
                }),
            }
        ),
        putInvoiceUserSetting: builder.mutation<IResponse<ISuccesRes>, IInvoiceUserSettingSubmit>(
            {
                query: (payload) => ({
                    url: `SendInvoiceUserSettings/PutSendInvoiceUserSetting`,
                    method: "PUT",
                    body: payload
                }),
            }
        ),
    
        getOrder: builder.mutation<IResponse<IGetOrderRes>, IGetOrder>(
            {
                query: (payload) => ({
                    url: `Order/GetOrder`,
                    method: "GET", 
                      params: payload
                }),
            }
        ),

    }),
});


export const { usePostOrderMutation,
    useGetInvoiceUserSettingQuery,
    usePostInvoiceUserSettingMutation,
    usePutInvoiceUserSettingMutation,
    usePaymentDataMutation,
    useGetLogoutMutation,
    useGetOrderMutation,
    useGetActiveUserSerialsQuery


} = onlineExtraValuesApi;
