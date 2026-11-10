"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertCircle,
  ArrowLeft,
  Car,
  Check,
  ChefHat,
  Clock,
  DoorOpen,
  Layers,
  Lightbulb,
  MapPin,
  Moon,
  Package,
  Ruler,
  Snowflake,
  Sparkles,
  Sun,
  Users,
  Utensils,
  Volume2,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react"

import { BookingCard } from "@/components/StudioDetails/booking-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getStudioDetailsUrl,
  normalizeStudioDetails,
  type RawStudio,
  type StudioDetails,
} from "@/lib/studios"

const amenityIcons: { match: RegExp; icon: LucideIcon }[] = [
  { match: /wi-?fi|internet/i, icon: Wifi },
  { match: /air|condition|climate|ventilation/i, icon: Wind },
  { match: /parking|garage/i, icon: Car },
  { match: /makeup|hair|vanity/i, icon: Sparkles },
  { match: /chang|wardrobe|dressing/i, icon: DoorOpen },
  { match: /kitchen|food|catering|coffee/i, icon: ChefHat },
  { match: /natural|sunlight|daylight/i, icon: Sun },
  { match: /blackout|dark/i, icon: Moon },
  { match: /sound|audio|acoustic/i, icon: Volume2 },
  { match: /elevator|freight/i, icon: Package },
  { match: /cyc|wall|backdrop/i, icon: Layers },
  { match: /light/i, icon: Lightbulb },
  { match: /utensil|sink/i, icon: Utensils },
  { match: /heat|cold|temperature/i, icon: Snowflake },
]

function getAmenityIcon(amenity: string): LucideIcon {
  return (
    amenityIcons.find(({ match }) => match.test(amenity))?.icon ?? Check
  )
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 shadow-soft">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/studios"
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Back to studios
    </Link>
  )
}

export function StudioDetailsView({ studioId }: { studioId: string }) {
  const [studio, setStudio] = useState<StudioDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<"not-found" | "network" | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadStudio() {
      try {
        const response = await fetch(getStudioDetailsUrl(studioId), {
          signal: controller.signal,
        })

        if (response.status === 404) {
          throw new Error("not-found")
        }

        if (!response.ok) {
          throw new Error("network")
        }

        const body = await response.text()

        if (!body.trim()) {
          throw new Error("not-found")
        }

        let data: unknown

        try {
          data = JSON.parse(body)
        } catch {
          throw new Error("network")
        }

        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("not-found")
        }

        const normalized = normalizeStudioDetails(data as RawStudio)

        if (!normalized) {
          throw new Error("not-found")
        }

        setStudio(normalized)
        setError(null)
      } catch (loadError) {
        if (controller.signal.aborted) return

        setError(
          loadError instanceof Error && loadError.message === "not-found"
            ? "not-found"
            : "network"
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadStudio()

    return () => controller.abort()
  }, [studioId, retryKey])

  function retry() {
    setLoading(true)
    setError(null)
    setRetryKey((key) => key + 1)
  }

  if (loading) {
    return <StudioDetailsSkeleton />
  }

  if (error) {
    return <StudioDetailsError notFound={error === "not-found"} onRetry={retry} />
  }

  if (!studio) {
    return null
  }

  const capacityLabel =
    studio.capacity > 0 ? `Up to ${studio.capacity} people` : "Not specified"
  const sizeLabel = studio.size > 0 ? `${studio.size} sq ft` : "Not specified"
  const rateLabel =
    studio.hourlyRate > 0
      ? `${formatMoney(studio.hourlyRate)} / hour`
      : "Contact host"

  return (
    <main className="flex-1">
      <div className="container-page pb-16 pt-6 md:pt-10">
        <BackLink />

        <div className="mt-6 md:mt-8">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-accent px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-accent-foreground">
            {studio.categoryLabel}
          </span>

          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] md:text-6xl">
            {studio.title}
          </h1>

          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground md:text-base">
            <MapPin className="size-4 text-primary" />
            {studio.location}
          </p>
        </div>

        <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={studio.image}
              alt={studio.title}
              fill
              preload
              sizes="(min-width: 1280px) 80rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute bottom-5 left-5 rounded-full bg-background/90 px-4 py-2 text-xs font-semibold text-foreground shadow-soft backdrop-blur">
              {studio.categoryLabel}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCard icon={Users} label="Capacity" value={capacityLabel} />
              <InfoCard icon={Ruler} label="Size" value={sizeLabel} />
              <InfoCard icon={Clock} label="Hourly rate" value={rateLabel} />
            </div>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <h2 className="text-2xl font-semibold md:text-3xl">
                About the space
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground md:text-base">
                {studio.description ||
                  "The host hasn't added a description for this studio yet."}
              </p>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <h2 className="text-2xl font-semibold md:text-3xl">Amenities</h2>

              {studio.amenities.length > 0 ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {studio.amenities.map((amenity, index) => {
                    const Icon = getAmenityIcon(amenity)

                    return (
                      <div
                        key={`${amenity}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/60 px-4 py-3"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                          <Icon className="size-4" />
                        </span>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  The host hasn&apos;t listed amenities for this studio yet.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Hosted by</p>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-xl font-semibold text-primary">
                  {studio.hostName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold">{studio.hostName}</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground md:text-base">
                    {studio.hostBio ||
                      "This host hasn't added a bio yet."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingCard studio={studio} />
          </aside>
        </div>
      </div>
    </main>
  )
}

export function StudioDetailsSkeleton() {
  return (
    <main className="flex-1">
      <div className="container-page pb-16 pt-6 md:pt-10">
        <Skeleton className="h-5 w-32 rounded-full" />

        <div className="mt-7 space-y-4">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-12 w-3/4 max-w-2xl rounded-2xl md:h-16" />
          <Skeleton className="h-5 w-44 rounded-full" />
        </div>

        <Skeleton className="mt-7 aspect-[16/10] w-full rounded-[2rem] sm:aspect-[16/9] md:aspect-[21/9]" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} className="h-[4.75rem] rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-56 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-44 rounded-3xl" />
          </div>

          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    </main>
  )
}

export function StudioDetailsError({
  notFound,
  onRetry,
}: {
  notFound: boolean
  onRetry: () => void
}) {
  return (
    <main className="flex-1">
      <div className="container-page pb-16 pt-6 md:pt-10">
        <BackLink />

        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-soft">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
            <AlertCircle className="size-5" />
          </span>

          <h1 className="mt-5 text-3xl font-semibold">
            {notFound ? "Studio not found" : "We couldn't load this studio"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            {notFound
              ? "This listing may have been removed or the link is incorrect."
              : "Make sure the studio API is running, then try again."}
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {!notFound ? (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                Try again
              </button>
            ) : null}

            <Link
              href="/studios"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Browse studios
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
