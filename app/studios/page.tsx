import type { Metadata } from "next"

import { Suspense } from "react"
import { ExploreView } from "@/components/Explore/explore-view"
import { Spinner } from "@/components/ui/spinner"

export const metadata: Metadata = {
  title: "Explore — StudioSpace",
  description:
    "Browse photography, film, podcast and music studios ready to book by the hour.",
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<Spinner className="mx-auto mt-20" />}>
      <main className="container-page flex-1 pb-16 pt-10 md:pt-14">
      <p className="eyebrow">Explore</p>
      <h1 className="mt-3 text-5xl font-semibold md:text-6xl">
        Find your next set
      </h1>
      <ExploreView />
    </main>
    </Suspense>
  )
}
    
