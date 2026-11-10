import type { Metadata } from "next"

import { MyListingsView } from "@/components/MyListings/my-listings-view"

export const metadata: Metadata = {
  title: "My listings — StudioSpace",
  description:
    "Manage the studios you host, track ratings and booked revenue, and keep your listings up to date.",
}

export default function MyListingsPage() {
  return (
    <main className="flex-1 pb-16 pt-10 md:pt-14">
      <MyListingsView />
    </main>
  )
}
