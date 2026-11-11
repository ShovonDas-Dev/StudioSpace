import { NextResponse } from "next/server";

import { db } from "@/lib/auth";
import { ownsEmail, requireAuth } from "@/lib/authz";
import {
  BOOKING_API_URL,
  fetchBookingById,
  type Booking,
} from "@/lib/bookings";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  const { id } = await ctx.params;

  const result = await requireAuth(request);

  if (!result.ok) {
    return result.response;
  }

  const authorization = request.headers.get("authorization") ?? "";

  const booking: Booking | null = await fetchBookingById(id, authorization);

  if (!booking) {
    return NextResponse.json(
      { message: "Booking not found" },
      { status: 404 }
    );
  }

  if (!ownsEmail(result.auth, booking.email)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await db.collection("bookingStatus").updateOne(
    { bookingId: id },
    {
      $set: {
        bookingId: id,
        status: "Cancelled",
        updatedAt: new Date().toISOString(),
        updatedBy: result.auth.userId,
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ ...booking, status: "Cancelled" });
}

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  const { id } = await ctx.params;

  const result = await requireAuth(request);

  if (!result.ok) {
    return result.response;
  }

  const authorization = request.headers.get("authorization") ?? "";

  const booking: Booking | null = await fetchBookingById(id, authorization);

  if (!booking) {
    return NextResponse.json(
      { message: "Booking not found" },
      { status: 404 }
    );
  }

  if (!ownsEmail(result.auth, booking.email)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const res = await fetch(
    `${BOOKING_API_URL}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: { Authorization: authorization },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { message: "Booking service unavailable" },
      { status: 502 }
    );
  }

  await db.collection("bookingStatus").deleteOne({ bookingId: id });

  return NextResponse.json({ message: "Booking deleted" });
}
