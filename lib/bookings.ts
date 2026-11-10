export const BOOKING_REQUESTS_KEY = "studiospace:booking-requests";

export type BookingRequest = {
  id: string;
  studioId: string;
  studioTitle: string;
  hostName: string;
  guestName: string;
  guestEmail: string;
  date: string;
  time: string;
  hours: number;
  hourlyRate: number;
  deposit: number;
  total: number;
  createdAt: string;
};

type NewBookingRequest = Omit<BookingRequest, "id" | "createdAt">;

export function saveBookingRequest(request: NewBookingRequest): BookingRequest {
  const saved: BookingRequest = {
    ...request,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  if (typeof window === "undefined") return saved;

  try {
    const raw = window.localStorage.getItem(BOOKING_REQUESTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const existing = Array.isArray(parsed) ? parsed : [];
    window.localStorage.setItem(
      BOOKING_REQUESTS_KEY,
      JSON.stringify([...existing, saved])
    );
  } catch {
    return saved;
  }

  return saved;
}
