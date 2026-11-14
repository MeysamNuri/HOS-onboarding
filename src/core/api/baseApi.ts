import { createApi } from '@reduxjs/toolkit/query/react'
import { portfolioBaseQuery } from './portfolioBaseQuery';
import type { IResponse } from '../types/responseModel';
import type { IGetUser, ILogout, IProposePackage, IProposePackageRes, IServicePacket, IServicePacketRes, IToken, ITokenRes, IValidationToken, IValidationTokenRes } from '../types/models';


export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: portfolioBaseQuery,

  endpoints: (builder) => ({
    getLogout: builder.mutation<IResponse<ILogout>, void>(
      {
        query: () => ({
          url: `Auth/Logout`,
          method: "GET",
        }),
      }
    ),
    getServicePacket: builder.query<IResponse<IServicePacketRes>, IServicePacket>(
      {
        query: ({ serviceCode, agentCode,discountCode,type ,category}) => {
          
          const params: Record<string, string> = { serviceCode };

          if (agentCode) {
            params.agentCode = agentCode;
          }
          
          if (discountCode) {
            params.discountCode = discountCode;
          }
          if (type) {
            params.type = type;
          }
          if (category) {
            params.category = category;
          }
          return {
            url: "/ServicePacket/GetServicePacket", 
            params,
          };
        }
      }
    ),
    getToken: builder.mutation<IResponse<ITokenRes>, IToken>(
      {
        query: (payload) => ({
          url: `Auth/GetToken`,
          method: "POST",
          body: payload
        }),
      }
    ),
    proposedPackage: builder.mutation<IResponse<IProposePackageRes>, IProposePackage>(
      {
        query: (payload) => ({
          url: `ProposedPackage/PostProposedPackage`,
          method: "POST",
          body: payload
        }),
      }
    ),
    tokenValidation: builder.mutation<IResponse<IValidationTokenRes>, IValidationToken>(
      {
        query: (payload) => ({
          url: `Auth/ValidateToken`,
          method: "POST",
          body: payload
        }),
      }
    ),
    getUser: builder.mutation<IResponse<IGetUser>, void>(
      {
        query: () => ({
          url: `User/GetUserInfo`,
          method: "GET",

        }),
      }
    ),

  }),
})


export const {

  useGetLogoutMutation,
  useGetServicePacketQuery,
  useGetTokenMutation,
  useTokenValidationMutation,
  useGetUserMutation,
  useProposedPackageMutation
} = baseApi;
