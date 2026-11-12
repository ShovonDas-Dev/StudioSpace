
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "cn"

import { StudioCard } from "@/components/Explore/studio-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { API_URL, normalizeStudio, type Studio } from "@/lib/studios"

const categories = [
  { value: "all", label: "All" },
  { value: "photography", label: "Photography" },
  { value: "film", label: "Film & Video" },
  { value: "podcast", label: "Podcast" },
  { value: "music", label: "Music" },
  { value: "creator", label: "Creator & Movement" },
]

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
]

export function ExploreView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL থেকে initial category নেওয়া
  const getUrlCategory = () => {
    const value = searchParams.get("category")

    return categories.some((item) => item.value === value)
      ? value!
      : "all"
  }

  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState(getUrlCategory)
  const [location, setLocation] = useState("all")
  const [sort, setSort] = useState("recommended")


  useEffect(() => {
    const urlCategory = searchParams.get("category")

    const validCategory = categories.some(
      (item) => item.value === urlCategory
    )

    setCategory(validCategory ? urlCategory! : "all")
  }, [searchParams])


  function handleCategoryChange(value: string) {
    setCategory(value)

    const params = new URLSearchParams(searchParams.toString())

    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }

    const queryString = params.toString()

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    )
  }

  // API থেকে studios fetch
  useEffect(() => {
    const controller = new AbortController()

    const getStudios = async () => {
      try {
        setLoading(true)
        setError(false)

        const categoryQuery =
          category === "all"
            ? ""
            : `?category=${encodeURIComponent(category)}`

        const response = await fetch(
          `${API_URL}${categoryQuery}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch studios")
        }

        const data = await response.json()

        const normalizedStudios = data
          .map(normalizeStudio)
          .filter((studio: Studio | null): studio is Studio => Boolean(studio))

        setStudios(normalizedStudios)
      } catch (err) {
        if (controller.signal.aborted) return

        console.error("Studio fetch error:", err)
        setError(true)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    getStudios()

    return () => controller.abort()
  }, [category])


  const locationItems = useMemo(() => {
    const uniqueLocations = [
      ...new Set(studios.map((studio) => studio.location)),
    ]

    return [
      { value: "all", label: "All locations" },
      ...uniqueLocations.map((item) => ({
        value: item,
        label: item,
      })),
    ]
  }, [studios])

  // Search, location এবং category filter
  const visibleStudios = useMemo(() => {
    const term = query.trim().toLowerCase()

    const filtered = studios.filter((studio) => {
      // Category filter
      if (
        category !== "all" &&
        studio.category.toLowerCase() !== category.toLowerCase()
      ) {
        return false
      }

      // Location filter
      if (location !== "all" && studio.location !== location) {
        return false
      }

      // Search filter
      if (
        term &&
        !`${studio.name} ${studio.location} ${studio.description} ${studio.categoryLabel} ${studio.amenities.join(" ")}`
          .toLowerCase()
          .includes(term)
      ) {
        return false
      }

      return true
    })

    // Sorting
    if (sort === "price-asc") {
      filtered.sort((a, b) => a.hourlyRate - b.hourlyRate)
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.hourlyRate - a.hourlyRate)
    }

    return filtered
  }, [studios, category, location, query, sort])

  // Reset filters
  function resetFilters() {
    setQuery("")
    setCategory("all")
    setLocation("all")
    setSort("recommended")

    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")

    const queryString = params.toString()

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    )
  }

  if (loading) {
    return <ExploreSkeleton />
  }

  if (error) {
    return <ExploreError />
  }

  return (
    <>
      <p className="mt-4 text-muted-foreground">
        {visibleStudios.length}{" "}
        {visibleStudios.length === 1 ? "studio is" : "studios are"} ready to
        book by the hour.
      </p>

      <div className="mt-6 rounded-3xl border border-border bg-card p-3 shadow-soft">

        {/* Search and Select */}
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, gear or neighborhood"
              aria-label="Search studios"
              className="h-11 rounded-full border-input pl-11 pr-4"
            />
          </div>

          <div className="flex gap-2">

            {/* Location */}
            <Select
              items={locationItems}
              value={location}
              onValueChange={(value) => setLocation(value ?? "all")}
            >
              <SelectTrigger
                aria-label="Filter by location"
                className="h-11 w-44 rounded-xl border-input px-4"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {locationItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select
              items={sortOptions}
              value={sort}
              onValueChange={(value) =>
                setSort(value ?? "recommended")
              }
            >
              <SelectTrigger
                aria-label="Sort studios"
                className="h-11 w-44 rounded-xl border-input px-4"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {sortOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 px-1 pb-1 pt-3">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => handleCategoryChange(item.value)}
              className={cn(
                "h-9 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors",
                category === item.value
                  ? "bg-foreground text-background"
                  : "border border-border bg-card hover:border-foreground/30"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {visibleStudios.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="text-lg font-semibold">
            No studios match your search
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword, location or category.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 h-10 cursor-pointer rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-foreground/85"
          >
            Clear filters
          </button>
        </div>
      ) : (

        /* Studio Cards */
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStudios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>

      )}

      <p className="mt-12 text-center text-sm text-muted-foreground">
        Own a space?{" "}
        <Link
          href="/add-studio"
          className="font-semibold text-primary hover:underline"
        >
          List it on StudioSpace
        </Link>
      </p>
    </>
  )
}

export function ExploreSkeleton() {
  return (
    <div>
      <div className="mt-4 h-4 w-64 animate-pulse rounded-full bg-muted" />

      <div className="mt-6 rounded-3xl border border-border bg-card p-3">
        <div className="h-11 w-full animate-pulse rounded-full bg-muted" />

        <div className="flex flex-wrap gap-2 px-1 pb-1 pt-3">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="h-9 w-28 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div className="aspect-[3/2] animate-pulse bg-muted" />

            <div className="space-y-3 p-5">
              <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ExploreError() {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-lg font-semibold">
        Studios are unavailable right now
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Make sure the studio API is running, then refresh this page.
      </p>
    </div>
  )
}
