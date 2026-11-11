import { NextResponse } from "next/server";

import { db } from "@/lib/auth";
import { requireAuth } from "@/lib/authz";
import {
  BOOKING_API_URL,
  normalizeBooking,
  saveBookingRequest,
  type Booking,
} from "@/lib/bookings";
import {
  getStudioDetailsUrl,
  normalizeStudioDetails,
  type RawStudio,
} from "@/lib/studios";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MIN_DURATION = 1;
const MAX_DURATION = 8;

export async function GET(request: Request) {
  const result = await requireAuth(request);

  if (!result.ok) {
    return result.response;
  }

  const { auth } = result;
  const authorization = request.headers.get("authorization") ?? "";

  try {
    const res = await fetch(BOOKING_API_URL, {
      cache: "no-store",
      headers: { Authorization: authorization },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Booking service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    let bookings = (Array.isArray(data) ? data : [])
      .map(normalizeBooking)
      .filter((booking): booking is Booking => booking !== null);

    if (auth.role !== "admin") {
      const email = auth.email.toLowerCase();
      bookings = bookings.filter(
        (booking) => booking.email.trim().toLowerCase() === email
      );
    }

    const overrides = await db
      .collection("bookingStatus")
      .find(
        { bookingId: { $in: bookings.map((booking) => booking._id) } },
        { projection: { bookingId: 1, status: 1 } }
      )
      .toArray();

    const statusById = new Map(
      overrides.map((o) => [
        String(o.bookingId),
        String(o.status ?? "Confirmed"),
      ])
    );

    bookings = bookings.map((booking) => ({
      ...booking,
      status: statusById.get(booking._id) ?? booking.status,
    }));

    return NextResponse.json({ message: "Bookings fetched", bookings });
  } catch {
    return NextResponse.json(
      { message: "Booking service unavailable" },
      { status: 502 }
    );
  }
}

export async function POST(request: Request) {
  const result = await requireAuth(request);

  if (!result.ok) {
    return result.response;
  }

  const { auth } = result;
  const authorization = request.headers.get("authorization") ?? "";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const input = (body ?? {}) as Record<string, unknown>;
  const studioId = typeof input.studioId === "string" ? input.studioId.trim() : "";
  const bookingDate =
    typeof input.bookingDate === "string" ? input.bookingDate : "";
  const bookingTime =
    typeof input.bookingTime === "string" ? input.bookingTime : "";
  const duration = Number(input.bookingDuration);

  if (!studioId) {
    return NextResponse.json({ message: "studioId is required" }, { status: 400 });
  }

  if (!DATE_PATTERN.test(bookingDate)) {
    return NextResponse.json(
      { message: "bookingDate must be a valid date (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  if (!TIME_PATTERN.test(bookingTime)) {
    return NextResponse.json(
      { message: "bookingTime must be a valid time (HH:MM)" },
      { status: 400 }
    );
  }

  if (
    !Number.isInteger(duration) ||
    duration < MIN_DURATION ||
    duration > MAX_DURATION
  ) {
    return NextResponse.json(
      { message: `bookingDuration must be between ${MIN_DURATION} and ${MAX_DURATION}` },
      { status: 400 }
    );
  }

  try {
    const studioRes = await fetch(getStudioDetailsUrl(studioId), {
      cache: "no-store",
    });

    if (!studioRes.ok) {
      return NextResponse.json(
        { message: "Studio not found" },
        { status: 404 }
      );
    }

    const studio = normalizeStudioDetails(
      (await studioRes.json()) as RawStudio
    );

    if (!studio || studio.id !== studioId) {
      return NextResponse.json(
        { message: "Studio not found" },
        { status: 404 }
      );
    }

    const dbUser = await db.collection("user").findOne(
      { email: auth.email },
      { projection: { name: 1, image: 1 } }
    );

    const subtotal = studio.hourlyRate * duration;
    const total = subtotal + studio.deposit;

    const booking = {
      email: auth.email,
      name:
        typeof dbUser?.name === "string" && dbUser.name.trim()
          ? dbUser.name
          : "StudioSpace user",
      userImage: typeof dbUser?.image === "string" ? dbUser.image : "",
      studioId: studio.id,
      title: studio.title,
      category: studio.category,
      categoryLabel: studio.categoryLabel,
      image: studio.image,
      location: studio.location,
      description: studio.description,
      hostName: studio.hostName,
      hostBio: studio.hostBio,
      bookingDate,
      bookingTime,
      bookingDuration: duration,
      bookingSubtotal: subtotal,
      bookingTotal: total,
      status: "Confirmed",
    };

    await saveBookingRequest(booking, authorization);

    return NextResponse.json(
      { message: "Booking created", booking },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Booking service unavailable" },
      { status: 502 }
    );
  }
}
