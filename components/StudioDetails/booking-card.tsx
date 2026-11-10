"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Clock, LoaderCircle, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { saveBookingRequest } from "@/lib/bookings"
import type { StudioDetails } from "@/lib/studios"

const fieldClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const hourOptions = [1, 2, 3, 4, 5, 6, 7, 8]

function formatMoney(value: number): string {
  return `$${value.toLocaleString("en-US")}`
}

export function BookingCard({ studio }: { studio: StudioDetails }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  // console.log(user)
  // console.log("User session:", user?.id, user?.email, user?.name ,user?.image)

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("10:00")
  const [hours, setHours] = useState("2")

  const today = new Date().toISOString().slice(0, 10)
  const duration = Number(hours)
  const subtotal = studio.hourlyRate * duration
  const total = subtotal + studio.deposit
  const hasRate = studio.hourlyRate > 0

  // console.log(studio)

  async function handleBookClick (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (isPending) return
    if (!user) {
      router.push("/login")
      return
    }

   

    setOpen(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date || !user) return

     const data = {
      email: user?.email,
      name: user?.name,
      userImage: user?.image,
      ...studio,
     
      bookingDate: date,
      bookingTime: time,
      bookingDuration: duration,
      bookingSubtotal: subtotal,
      bookingTotal: total,
    }

    const res = await fetch("http://localhost:5000/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    
    console.log(res)
    
    setOpen(false)
    setDate("")
    toast.add({
      title: "Booking request saved",
      description: `${studio.title} · ${date} at ${time}`,
      type: "success",
    })
  }

  return (
    <>
      <div className="rounded-3xl border border-border bg-card p-6 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">From</p>
            <p className="mt-2 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold tracking-tight">
                {hasRate ? formatMoney(studio.hourlyRate) : "Rate on request"}
              </span>
              {hasRate ? (
                <span className="text-sm text-muted-foreground">/ hour</span>
              ) : null}
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {studio.categoryLabel}
          </span>
        </div>

        <Separator className="my-5" />

        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4" />
              Security deposit
            </dt>
            <dd className="font-semibold">
              {studio.deposit > 0 ? formatMoney(studio.deposit) : "None"}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              Billed by the hour
            </dt>
            <dd className="font-semibold">
              {hasRate ? `${formatMoney(studio.hourlyRate)} / hr` : "—"}
            </dd>
          </div>
        </dl>

        <Button
          onClick={handleBookClick}
          disabled={isPending}
          className="mt-6 h-12 w-full rounded-full text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Checking availability
            </>
          ) : (
            "Book This Studio"
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          {user
            ? "You won't be charged until the host confirms."
            : "Sign in to send a booking request."}
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Book {studio.title}</DialogTitle>
            <DialogDescription>
              Pick a date and session length. The host will confirm
              availability before any payment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-date">Date</Label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="booking-date"
                    type="date"
                    min={today}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                    className={`${fieldClass} pl-9`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-time">Start time</Label>
                <Input
                  id="booking-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-hours">Duration</Label>
              <select
                id="booking-hours"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                className={fieldClass}
              >
                {hourOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} {option === 1 ? "hour" : "hours"}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  {hasRate
                    ? `${formatMoney(studio.hourlyRate)} × ${duration} ${
                        duration === 1 ? "hour" : "hours"
                      }`
                    : "Studio rate"}
                </span>
                <span className="font-semibold">
                  {hasRate ? formatMoney(subtotal) : "—"}
                </span>
              </div>

              {studio.deposit > 0 ? (
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Security deposit
                  </span>
                  <span className="font-semibold">
                    {formatMoney(studio.deposit)}
                  </span>
                </div>
              ) : null}

              <Separator className="my-3" />

              <div className="flex items-center justify-between gap-4 font-semibold">
                <span>Estimated total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>

            <DialogFooter className="mt-2">
              <Button
                type="submit"
                disabled={!date}
                className="h-11 w-full rounded-full text-sm font-semibold sm:w-auto"
              >
                Send booking request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
