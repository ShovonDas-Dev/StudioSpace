export const API_URL = "http://localhost:5000/allStudio";

const FALLBACK_IMAGE = "/assets/studio-photo-dRYpf4Lz.jpg";

export const categoryLabels: Record<string, string> = {
  photography: "Photography",
  film: "Film & Video",
  podcast: "Podcast",
  music: "Music",
  creator: "Creator & Movement",
};

export type Studio = {
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

type RawStudio = {
  _id?: string;
  id?: string;
  studioName?: string;
  title?: string;
  category?: string;
  coverImage?: string;
  image?: string;
  hourlyRate?: number | string;
  capacity?: number | string;
  location?: string;
  description?: string;
  amenities?: unknown;
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

export function normalizeStudio(raw: RawStudio): Studio | null {
  const id = raw._id ?? raw.id;
  if (!id) return null;

  const category = raw.category ?? "";
  const seed = hashId(id);
  const rating = Math.round((4.5 + (seed % 50) / 100) * 10) / 10;
  const reviews = 20 + (Math.floor(seed / 50) % 160);

  return {
    id,
    name: raw.studioName ?? raw.title ?? "Untitled studio",
    category,
    categoryLabel: categoryLabels[category] ?? "Studio",
    image: raw.coverImage ?? raw.image ?? FALLBACK_IMAGE,
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
