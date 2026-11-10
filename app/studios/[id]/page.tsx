import type { Metadata } from "next"

import { StudioDetailsView } from "@/components/StudioDetails/studio-details-view"

export const metadata: Metadata = {
  title: "Studio details — StudioSpace",
  description:
    "View studio photos, amenities, host details and hourly pricing, then request a booking.",
}

export default async function StudioDetailsPage({
  params,
}: PageProps<"/studios/[id]">) {
  const { id } = await params

  return <StudioDetailsView key={id} studioId={id} />
}
