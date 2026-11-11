import type { Metadata } from "next"
import { Suspense } from "react"

import { StudioDetailsView } from "@/components/StudioDetails/studio-details-view"

export const metadata: Metadata = {
  title: "Studio details — StudioSpace",
  description:
    "View studio photos, amenities, host details and hourly pricing, then request a booking.",
}

export default function StudioDetailsPage({
  params,
}: PageProps<"/studios/[id]">) {
  return (
    <Suspense fallback={null}>
      <StudioDetailsContent params={params} />
    </Suspense>
  )
}

// The studio id is only known at request time (the listing comes from the
// API), so awaiting params must happen inside the Suspense boundary above.
async function StudioDetailsContent({
  params,
}: Pick<PageProps<"/studios/[id]">, "params">) {
  const { id } = await params

  return <StudioDetailsView key={id} studioId={id} />
}
