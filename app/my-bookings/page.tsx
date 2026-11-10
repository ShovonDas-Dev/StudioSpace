import type { Metadata } from "next"

import { MyBookingsView } from "@/components/MyBookings/my-bookings-view"

export const metadata: Metadata = {
  title: "My bookings — StudioSpace",
  description:
    "Your booked studio sessions — dates, times, locations and totals in one place.",
}

export default function MyBookingsPage() {
  return (
    <main className="flex-1 pb-16 pt-10 md:pt-14">
      <MyBookingsView />
    </main>
  )
}
