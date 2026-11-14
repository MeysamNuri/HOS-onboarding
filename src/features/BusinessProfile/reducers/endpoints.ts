import { baseApi } from "@/core/api/baseApi";
import type { IResponse } from "@/core/types/responseModel";
import type { BusinessProfile } from "../types";

export const businessProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessProfile: builder.query<BusinessProfile, string>({
      query: (slug) => ({
        url: "Business/GetBySlug",
        params: { slug },
      }),
      transformResponse: (response: IResponse<BusinessProfile>) => {
        if (!response.Status || !response.Data?.name) {
          throw new Error("Invalid business profile response");
        }
        return response.Data;
      },
    }),
  }),
});

export const { useGetBusinessProfileQuery } = businessProfileApi;
