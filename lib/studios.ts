import { firstImage } from "@/lib/image";

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/allStudio`;

export const categoryLabels: Record<string, string> = {
  photography: "Photography",
  film: "Film & Video",
  podcast: "Podcast",
  music: "Music",
  creator: "Creator & Movement",
};

export type Studio = {
  _id?: string;
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  image: string;
  hourlyRate: number;
  capacity: number;
  location: string;
  description: string;
  amenities: string[];
  rating: number;
  reviews: number;
};

export type StudioDetails = {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  image: string;
  hourlyRate: number;
  deposit: number;
  capacity: number;
  size: number;
  location: string;
  description: string;
  amenities: string[];
  hostName: string;
  hostBio: string;
};

export type RawStudio = {
  _id?: string;
  id?: string;
  studioName?: string;
  title?: string;
  category?: string;
  coverImage?: string;
  image?: string;
  hourlyRate?: number | string;
  deposit?: number | string;
  securityDeposit?: number | string;
  capacity?: number | string;
  size?: number | string;
  location?: string;
  description?: string;
  amenities?: unknown;
  hostName?: string;
  hostBio?: string;
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

export function normalizeStudio(raw: RawStudio): Studio | null {
  

  const category = raw.category ?? "";
  const seed = hashId(raw.id ?? raw._id ?? Math.random().toString());
  const rating = Math.round((4.5 + (seed % 50) / 100) * 10) / 10;
  const reviews = 20 + (Math.floor(seed / 50) % 160);

  return {
    _id: raw._id,
    id : raw._id ?? raw.id ?? "",
    name: raw.studioName ?? raw.title ?? "Untitled studio",
    category,
    categoryLabel: categoryLabels[category] ?? "Studio",
    image: firstImage(raw.coverImage, raw.image),
    hourlyRate: Number(raw.hourlyRate) || 0,
    capacity: Number(raw.capacity) || 0,
    location: raw.location || "Location TBA",
    description: raw.description ?? "",
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.filter(
          (amenity): amenity is string => typeof amenity === "string"
        )
      : [],
    rating,
    reviews,
  };
}

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getStudioDetailsUrl(id: string): string {
  return `${API_URL}/${encodeURIComponent(id)}`;
}

export function normalizeStudioDetails(
  raw: RawStudio
): StudioDetails | null {
  const id = raw._id ?? raw.id;
  if (!id) return null;

  const category = raw.category ?? "";

  return {
    id,
    title: raw.studioName ?? raw.title ?? "Untitled studio",
    category,
    categoryLabel: categoryLabels[category] ?? "Studio",
    image: firstImage(raw.coverImage, raw.image),
    hourlyRate: toNumber(raw.hourlyRate),
    deposit: toNumber(raw.deposit ?? raw.securityDeposit),
    capacity: toNumber(raw.capacity),
    size: toNumber(raw.size),
    location: raw.location || "Location TBA",
    description: raw.description?.trim() ?? "",
    amenities: Array.isArray(raw.amenities)
      ? raw.amenities.filter(
          (amenity): amenity is string =>
            typeof amenity === "string" && amenity.trim().length > 0
        )
      : [],
    hostName: raw.hostName?.trim() || "StudioSpace host",
    hostBio: raw.hostBio?.trim() ?? "",
  };
}
