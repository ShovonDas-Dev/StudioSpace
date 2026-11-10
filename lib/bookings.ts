export const BOOKING_API_URL = "http://localhost:5000/booking";

export const FALLBACK_BOOKING_IMAGE = "/assets/studio-photo-dRYpf4Lz.jpg";

export type Booking = {
  _id: string;
  email: string;
  name: string;
  userImage: string;
  studioId: string;
  title: string;
  category: string;
  categoryLabel: string;
  image: string;
  location: string;
  bookingDate: string;
  bookingTime: string;
  bookingDuration: number;
  bookingSubtotal: number;
  bookingTotal: number;
  status: string;
};

export type RawBooking = {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  userImage?: string;
  title?: string;
  studioName?: string;
  category?: string;
  categoryLabel?: string;
  image?: string;
  coverImage?: string;
  location?: string;
  description?: string;
  hostName?: string;
  hostBio?: string;
  bookingDate?: string;
  bookingTime?: string;
  bookingDuration?: number | string;
  bookingSubtotal?: number | string;
  bookingTotal?: number | string;
  status?: string;
  [key: string]: unknown;
};

function toNumber(value: number | string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeBooking(raw: RawBooking): Booking | null {
  const id = raw._id;
  if (!id) return null;

  return {
    _id: id,
    email: raw.email ?? "",
    name: raw.name ?? "",
    userImage: raw.userImage ?? "",
    studioId: raw.id ?? "",
    title: raw.studioName ?? raw.title ?? "Untitled studio",
    category: raw.category ?? "",
    categoryLabel: raw.categoryLabel ?? "Studio",
    image: raw.coverImage || raw.image || FALLBACK_BOOKING_IMAGE,
    location: raw.location || "Location TBA",
    bookingDate: raw.bookingDate ?? "",
    bookingTime: raw.bookingTime ?? "",
    bookingDuration: toNumber(raw.bookingDuration),
    bookingSubtotal: toNumber(raw.bookingSubtotal),
    bookingTotal: toNumber(raw.bookingTotal),
    status: raw.status ?? "Confirmed",
  };
}

export type BookingRequestPayload = {
  email: string;
  name: string;
  userImage: string;
  [key: string]: unknown;
};

export async function saveBookingRequest(
  payload: BookingRequestPayload
): Promise<{ ok: boolean }> {
  const res = await fetch(BOOKING_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Booking request failed (${res.status})`);
  }

  return { ok: res.ok };
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Cancelled" }),
  });

  if (!res.ok) {
    throw new Error(`Cancel failed (${res.status})`);
  }

  const data = normalizeBooking(await res.json());
  if (!data) throw new Error("Cancelled booking returned invalid data");
  return data;
}
