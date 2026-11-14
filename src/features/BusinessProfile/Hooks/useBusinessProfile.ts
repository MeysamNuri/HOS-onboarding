import { useEffect } from "react";
import { useParams } from "react-router";
import { useGetBusinessProfileQuery } from "../reducers/endpoints";
import { demoProfile } from "../data/demoProfile";

export default function useBusinessProfile() {
  const { slug = "" } = useParams<{ slug: string }>();
  const preview = import.meta.env.VITE_BUSINESS_PROFILE_USE_API !== "true";
  const {
    currentData,
    error,
    isFetching,
    refetch,
  } = useGetBusinessProfileQuery(slug, { skip: preview || !slug });
  const business = preview ? demoProfile : currentData;
  const notFound =
    !slug || Boolean(error && "status" in error && error.status === 404);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = business
      ? business.name + " | معرفی کسب‌وکار"
      : "معرفی کسب‌وکار";
    return () => {
      document.title = previousTitle;
    };
  }, [business]);

  return { business, error, isFetching, notFound, retry: refetch };
}
