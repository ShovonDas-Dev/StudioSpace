"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  CirclePlus,
  Eye,
  LayoutGrid,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react"

import { BlockRoute } from "@/components/My UI/BlockRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { authClient, getJwtToken } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { normalizeStudio, type Studio } from "@/lib/studios"
import EditStudioDialog from "./EditStudioDialog"





const sidebarLinks = [
  { href: "/my-listings", label: "My listings", icon: LayoutGrid },
  { href: "/add-studio", label: "Add studio", icon: CirclePlus },
  { href: "/my-bookings", label: "My bookings", icon: CalendarDays },
]
type RawBooking = {
  _id?: string
  id?: string
  hourlyRate?: number | string
  hostEmail?: string
  bookingTotal?: number | string
  [key: string]: unknown
}

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`
}



export function MyListingsView() {
 
    const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const BOOKINGS_URL = user?.email
    ? `${process.env.API_URL}/allStudio?hostEmail=${encodeURIComponent(user.email)}`
    : null

  const [rows, setRows] = useState<RawBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Load data once
  useEffect(() => {
    if (isPending) return

    if (!BOOKINGS_URL) {
      setRows([])
      setLoading(false)
      return
    }

    let active = true

    async function loadListings() {
      try {
        setLoading(true)
        setError(false)

        const token = await getJwtToken()

        if (!token) throw new Error("No token")

        const res = await fetch(BOOKINGS_URL!, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error("Request failed")
        }

        const data = await res.json()

        if (active) {
          setRows(Array.isArray(data) ? data : [])
        }
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadListings()

    return () => {
      active = false
    }
  }, [isPending, BOOKINGS_URL])

  if (isPending || loading) return <MyListingsSkeleton />
  if (!user) return <BlockRoute />
  if (error) return <ListingsError />


 const myEmail = user.email?.toLowerCase()

const myRows = rows.filter((row) => {
  return (
    typeof row.hostEmail === "string" &&
    row.hostEmail.toLowerCase() === myEmail
  )
})

  const listings = myRows
    .map(normalizeStudio)
    .filter((studio): studio is Studio => studio !== null)

    // console.log("Normalized listings:", listings)

  const revenue = myRows.reduce((sum, row) => {
    const total = Number(row.bookingTotal)
    const rate = Number(row.hourlyRate)
    if (total > 0) return sum + total
    return sum + (rate > 0 ? rate : 0)
  }, 0)

  const avgRating =
    listings.length > 0
      ? listings.reduce((sum, s) => sum + s.rating, 0) / listings.length
      : null


  // .........................................................................................................

    console.log("Listings:", rows)
  async function handleDelete(studio: Studio) {

    try {
    const token = await getJwtToken()

    if (!token) throw new Error("No token")

    const res = await fetch(
      `${process.env.API_URL}/allStudio/${studio._id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    if (data.deletedCount > 0) {
      toast.add({
      title: "Listing removed",
      description: `${studio.name} is no longer shown on your dashboard.`,
      type: "success",
    })
    }
  } catch (error) {
    console.log(error);
  }

    setRows((current) =>
      current.filter((row) => (row._id ?? row.id) !== studio._id)
    )
    
  }

  return (
    <div className="container-page grid gap-10 lg:grid-cols-[16rem_1fr]">
      <Sidebar user={user} />

      <section className="min-w-0">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-3 text-5xl font-semibold md:text-6xl">
              My listings
            </h1>
            <p className="mt-3 text-muted-foreground">
              Everything you host, in one place.
            </p>
          </div>

          <Button
            render={<Link href="/add-studio" />}
            nativeButton={false}
            className="h-11 rounded-full px-5 text-sm font-semibold shadow-soft"
          >
            <Plus className="size-4" />
            Add studio
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <StatCard label="Active listings" value={String(listings.length)} />
          <StatCard
            label="Avg. rating"
            value={avgRating === null ? "—" : avgRating.toFixed(1)}
          />
          <StatCard label="Booked revenue" value={formatMoney(revenue)} />
        </div>

        {/* List */}
        {listings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 space-y-5">
            {listings.map((studio) => (
              <ListingCard
                key={studio.id}
                studio={studio}
                onDelete={() => handleDelete(studio)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

type SidebarUser = {
  name?: string | null
  email?: string | null
  image?: string | null
}

function Sidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname()

  return (
    <aside className="space-y-4">
      <div className="flex items-center gap-3 rounded-3xl border border-border bg-card p-5">
        <Avatar size="lg">
          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
          <AvatarFallback>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <nav aria-label="Dashboard" className="space-y-1">
        {sidebarLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/* Listing card                                                               */
/* -------------------------------------------------------------------------- */

function ListingCard({studio,onDelete,}: {studio: Studio , onDelete: () => void}) {
  // console.log("Rendering ListingCard for studio:", studio)
  const rate =
    studio.hourlyRate > 0
      ? `${formatMoney(studio.hourlyRate)}/hr`
      : "Rate on request"

      

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-44">
        <Image
          src={studio.image}
          alt={studio.name}
          fill
          sizes="(min-width: 640px) 11rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="eyebrow">{studio.categoryLabel}</p>
        <h3 className="mt-1 text-2xl font-semibold leading-tight">
          {studio.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{studio.location}</span>
          <span>{rate}</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Star className="size-4 fill-primary text-primary" />
            {studio.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        <Button
          render={<Link href={`/studios/${studio.id}`} />}
          nativeButton={false}
          variant="ghost"
          size="icon"
          aria-label={`View ${studio.name}`}
          className="size-10 rounded-full"
        >
          <Eye className="size-5" />
        </Button>
    {/* edit button */}
       <EditStudioDialog studio={studio} />

        <Button
          variant="outline"
          onClick={onDelete}
          className="h-10 rounded-full px-4 text-sm font-medium"
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{value}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-lg font-semibold">No listings yet</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Studios you add will show up here.
      </p>
      <Button
        render={<Link href="/add-studio" />}
        nativeButton={false}
        className="mt-6 h-10 rounded-full px-5 text-sm font-semibold"
      >
        <Plus className="size-4" />
        Add your first studio
      </Button>
    </div>
  )
}

function ListingsError() {
  return (
    <div className="container-page">
      <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <p className="text-lg font-semibold">
          Listings are unavailable right now
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Make sure the studio API is running, then refresh this page.
        </p>
      </div>
    </div>
  )
}

function MyListingsSkeleton() {
  const box = "animate-pulse bg-muted"

  return (
    <div className="container-page grid gap-10 lg:grid-cols-[16rem_1fr]">
      <div className="space-y-4">
        <div className={`${box} h-24 rounded-3xl`} />
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${box} h-12 rounded-2xl`} />
        ))}
      </div>

      <div className="min-w-0">
        <div className={`${box} h-14 w-72 rounded-full`} />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${box} h-32 rounded-3xl`} />
          ))}
        </div>
        <div className="mt-8 space-y-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${box} h-36 rounded-3xl`} />
          ))}
        </div>
      </div>
    </div>
  )
}
