import { MongoClient, ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import { normalizeBooking, type RawBooking } from "@/lib/bookings";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("studioSpace");

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  const { id } = await ctx.params;
  const bookingId = decodeURIComponent(id);

  if (!ObjectId.isValid(bookingId)) {
    return Response.json({ error: "Invalid booking id" }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  const email = session?.user?.email;

  if (!email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let status = "";
  try {
    const body = await request.json();
    if (body?.status !== "Cancelled") {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }
    status = body.status;
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const updated = await db
      .collection("bookingData")
      .findOneAndUpdate(
        { _id: new ObjectId(bookingId), email },
        { $set: { status } },
        { returnDocument: "after" }
      );

    if (!updated) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = normalizeBooking({
      ...updated,
      _id: updated._id.toString(),
    } as RawBooking);
    if (!booking) {
      return Response.json(
        { error: "Failed to read updated booking" },
        { status: 500 }
      );
    }
    return Response.json(booking);
  } catch {
    return Response.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
