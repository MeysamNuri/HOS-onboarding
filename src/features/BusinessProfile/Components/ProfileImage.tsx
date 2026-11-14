import { useState } from "react";
import { safeWebUrl } from "../helper/links";

interface ProfileImageProps {
  src?: string;
  alt: string;
  fallback?: string;
  eager?: boolean;
}

export default function ProfileImage({
  src,
  alt,
  fallback,
  eager = false,
}: ProfileImageProps) {
  const [failedSource, setFailedSource] = useState<string>();
  const source = src?.startsWith("/") && !src.startsWith("//") ? src : safeWebUrl(src);
  const resolved = source && source !== failedSource ? source : fallback;
  return resolved ? (
    <img
      src={resolved}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailedSource(source)}
    />
  ) : null;
}
