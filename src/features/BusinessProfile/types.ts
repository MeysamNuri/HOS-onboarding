export interface BusinessProfile {
  name: string;
  tagline?: string;
  logoUrl?: string;
  banner?: { imageUrl: string; alt: string; link?: string };
  introduction: string;
  introductionImageUrl?: string;
  productsDescription?: string;
  successStory?: string;
  phones: string[];
  address?: string;
  website?: string;
  map?: { imageUrl: string; link: string };
  socialLinks?: {
    platform: "instagram" | "telegram" | "whatsapp" | "bale" | "rubika";
    url: string;
  }[];
}
