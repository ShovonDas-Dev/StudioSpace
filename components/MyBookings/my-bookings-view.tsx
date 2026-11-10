"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  CalendarX,
  CirclePlus,
  Clock,
  LayoutGrid,
  MapPin,
  TriangleAlert,
} from "lucide-react"

import { BlockRoute } from "@/components/My UI/BlockRoute"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { cancelBooking, normalizeBooking, BOOKING_API_URL } from "@/lib/bookings"
import type { Booking } from "@/lib/bookings"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/my-listings", label: "My listings", icon: LayoutGrid },
  { href: "/add-studio", label: "Add studio", icon: CirclePlus },
  { href: "/my-bookings", label: "My bookings", icon: CalendarDays },
]

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`
}

function formatBookingDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return value || "—"
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

export function MyBookingsView() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  const [rows, setRows] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (isPending || !user?.email) return

    let active = true

    async function loadBookings() {
      try {
        const res = await fetch(BOOKING_API_URL)

        if (!res.ok) {
          throw new Error("Request failed")
        }

        const data = await res.json()
        const email = user?.email?.toLowerCase()
        const bookings = (Array.isArray(data) ? data : [])
          .map(normalizeBooking)
          .filter((booking): booking is Booking => booking !== null)
          .filter((booking) => booking.email.toLowerCase() === email)

        if (active) {
          setRows(bookings)
        }
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBookings()

    return () => {
      active = false
    }
  }, [isPending, user?.email])

  async function handleCancel(booking: Booking) {
    setCancellingId(booking._id)
    try {
      const updated = await cancelBooking(booking._id)
      setRows((current) =>
        current.map((row) => (row._id === updated._id ? updated : row))
      )
      toast.add({
        title: "Booking cancelled",
        description: `${booking.title} · ${formatBookingDate(booking.bookingDate)}`,
        type: "success",
      })
    } catch {
      toast.add({
        title: "Could not cancel booking",
        description: "Make sure the API is running, then try again.",
        type: "error",
      })
    } finally {
      setCancellingId(null)
    }
  }

  if (isPending || (loading && user)) return <MyBookingsSkeleton />
  if (!user) return <BlockRoute />
  if (error) return <BookingsError />

  return (
    <div className="container-page grid gap-10 lg:grid-cols-[16rem_1fr]">
      <Sidebar user={user} />

      <section className="min-w-0">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-3 text-5xl font-semibold md:text-6xl">
            My bookings
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your sessions, past and upcoming.
          </p>
        </div>

        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-8 space-y-5">
            {rows.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isCancelling={cancellingId === booking._id}
                onCancel={() => handleCancel(booking)}
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
          <p className="truncate text-sm text-muted-foreground">
            {user.email}
          </p>
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
/* Booking card                                                               */
/* -------------------------------------------------------------------------- */

function BookingCard({
  booking,
  isCancelling,
  onCancel,
}: {
  booking: Booking
  isCancelling: boolean
  onCancel: () => void
}) {
  const isCancelled = booking.status === "Cancelled"

  return (
    <article className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-44">
        <Image
          src={booking.image}
          alt={booking.title}
          fill
          sizes="(min-width: 640px) 11rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {isCancelled ? (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              Cancelled
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Confirmed
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            #bk-{booking._id}
          </span>
        </div>

        <h3 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {booking.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {formatBookingDate(booking.bookingDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {booking.bookingTime || "—"} · {booking.bookingDuration || 0}{" "}
            {booking.bookingDuration === 1 ? "hr" : "hrs"}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {booking.location}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-3">
        <p className="text-3xl font-bold tracking-tight md:text-4xl">
          {formatMoney(booking.bookingTotal)}
        </p>

        {isCancelled ? (
          <Button
            variant="outline"
            disabled
            className="h-10 rounded-full px-4 text-sm font-medium"
          >
            Cancelled
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isCancelling}
            className="h-10 rounded-full px-4 text-sm font-medium"
          >
            <CalendarX className="size-4" />
            {isCancelling ? "Cancelling…" : "Cancel"}
          </Button>
        )}
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-lg font-semibold">No bookings yet</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Sessions you book will show up here.
      </p>
      <Button
        render={<Link href="/studios" />}
        nativeButton={false}
        className="mt-6 h-10 rounded-full px-5 text-sm font-semibold"
      >
        Browse studios
      </Button>
    </div>
  )
}

function BookingsError() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <TriangleAlert className="size-6" />
      </div>
      <p className="mt-4 text-lg font-semibold">
        Bookings are unavailable right now
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Make sure the booking API is running, then refresh this page.
      </p>
    </div>
  )
}

function MyBookingsSkeleton() {
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
        <div className="mt-4 space-y-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`${box} h-36 rounded-3xl`} />
          ))}
        </div>
      </div>
    </div>
  )
}
