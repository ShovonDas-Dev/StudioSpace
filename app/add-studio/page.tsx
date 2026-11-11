"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ChevronDownIcon,
  CirclePlus,
  Form,
  LayoutGrid, 
} from "lucide-react"
import { cn } from "cn"
import { authClient, getJwtToken } from "@/lib/auth-client"

const inputClass =
  "flex h-12 w-full rounded-xl border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

const textareaClass =
  "flex min-h-[60px] w-full rounded-xl border border-input bg-background px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

const buttonClass =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"

const categories = [
  { id: "photography", label: "Photography" },
  { id: "film", label: "Film & Video" },
  { id: "podcast", label: "Podcast" },
  { id: "music", label: "Music" },
  { id: "creator", label: "Creator & Movement" },
]

const locations = [
  "Brooklyn, NY",
  "Los Angeles, CA",
  "Austin, TX",
  "Chicago, IL",
  "Atlanta, GA",
]

const amenities = [
  "Wi‑Fi",
  "Air conditioning",
  "Parking",
  "Makeup station",
  "Changing room",
  "Kitchenette",
  "Natural light",
  "Blackout",
  "Cyclorama",
  "Sound treated",
  "Lighting kit",
  "Freight elevator",
]

const dashboardLinks = [
  { href: "/my-listings", label: "My listings", icon: LayoutGrid },
  { href: "/add-studio", label: "Add studio", icon: CirclePlus },
  { href: "/my-bookings", label: "My bookings", icon: CalendarDays },
]

type FormState = {
  title: string
  category: string
  hourlyRate: string
  deposit: string
  capacity: string
  size: string
  location: string
  image: string
  amenities: string[]
  description: string
  hostName: string
  hostBio: string
  hostEmail: string
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold leading-none">{label}</label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

function SelectBox({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClass, "appearance-none pr-10")}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export default function AddStudioPage() {
  const { data: session } = authClient.useSession();

  const userName = session?.user.name
  const userEmail = session?.user.email
  const userImage = session?.user.image
  console.log("User info:", { userName, userEmail, userImage })

  const [form, setForm] = useState<FormState>({
    title: "",
    category: "photography",
    hourlyRate: "",
    deposit: "",
    capacity: "",
    size: "",
    location: "Brooklyn, NY",
    image: "",
    amenities: [],
    description: "",
    hostName: userName || "Maya Okafor",
    hostBio: "",
    hostEmail: userEmail || ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
    setSubmitted(false)
  }

  function toggleAmenity(amenity: string) {
    update(
      "amenities",
      form.amenities.includes(amenity)
        ? form.amenities.filter((item) => item !== amenity)
        : [...form.amenities, amenity]
    )
  }
//   submit form handler

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("Submitting form:", submitted, form)
    const nextErrors: Record<string, string> = {}

    if (form.title.trim().length < 3) {
      nextErrors.title = "Give your studio a name (3+ characters)."
    }
    if (!(Number(form.hourlyRate) > 0)) {
      nextErrors.hourlyRate = "Enter an hourly rate above $0."
    }
    if (form.deposit === "" || Number(form.deposit) < 0) {
      nextErrors.deposit = "Enter a deposit (0 is fine)."
    }
    if (!(Number(form.capacity) > 0)) {
      nextErrors.capacity = "How many people fit?"
    }
    if (form.description.trim().length < 30) {
      nextErrors.description = "Describe the space in at least 30 characters."
    }
    if (form.image && !/^https?:\/\/|^\/|^data:/.test(form.image)) {
      nextErrors.image = "Use a full image URL starting with https://"
    }
    if (!form.hostName.trim()) {
      nextErrors.hostName = "Add the host's name."
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
    }
    console.log("Form submitted:", form)

    // backend API call to send form data to the server

    const token = await getJwtToken()

    if (!token) throw new Error("No token")

    const res = await fetch("http://localhost:5000/add-studio" ,  {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
    })
    const data = await res.json()
    console.log("Server response:", data)


  }

  return (
    <main className="flex-1">
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="hidden items-center gap-3 rounded-2xl border border-border bg-card p-4 lg:flex">
            <div
              className="h-11 w-11 rounded-full bg-cover bg-center"
              style={{
                backgroundImage: userImage ? `url(${userImage})` : "url(https://i.pravatar.cc/160?img=47)",
              }}
            />
            <div className="min-w-0">
              <p className="truncate font-semibold">{userName || "Maya Okafor"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {userEmail || "maya@studiospace.co"}
              </p>
            </div>
          </div>

          <nav
            className="flex gap-2 overflow-x-auto lg:mt-4 lg:flex-col"
            aria-label="Dashboard"
          >
            {dashboardLinks.map(({ href, label, icon: Icon }) => {
              const active = href === "/add-studio"

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-ink text-ink-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Host</p>
              <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
                List a new studio
              </h1>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Most hosts finish in under five minutes. You can edit
                everything later.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-8">
            <section className="space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold">The space</h2>

              <Field label="Studio name" error={errors.title}>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="e.g. Sunbeam Cyc Loft"
                />
              </Field>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Category">
                  <SelectBox
                    value={form.category}
                    onChange={(value) => update("category", value)}
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.label,
                    }))}
                  />
                </Field>

                <Field label="Location">
                  <SelectBox
                    value={form.location}
                    onChange={(value) => update("location", value)}
                    options={locations.map((location) => ({
                      value: location,
                      label: location,
                    }))}
                  />
                </Field>
              </div>

              <Field
                label="Description"
                error={errors.description}
                hint="What makes it special? Light, sound, gear, vibe."
              >
                <textarea
                  className={cn(textareaClass, "min-h-32")}
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                />
              </Field>

              <Field
                label="Cover image URL"
                error={errors.image}
                hint="Leave empty to use a category photo."
              >
                <input
                  className={inputClass}
                  value={form.image}
                  onChange={(event) => update("image", event.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </section>

            <section className="space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold">Pricing & capacity</h2>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Hourly rate ($)" error={errors.hourlyRate}>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    value={form.hourlyRate}
                    onChange={(event) =>
                      update("hourlyRate", event.target.value)
                    }
                  />
                </Field>

                <Field label="Security deposit ($)" error={errors.deposit}>
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    value={form.deposit}
                    onChange={(event) => update("deposit", event.target.value)}
                  />
                </Field>

                <Field label="Capacity (people)" error={errors.capacity}>
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(event) => update("capacity", event.target.value)}
                  />
                </Field>

                <Field label="Size (sq ft)">
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    value={form.size}
                    onChange={(event) => update("size", event.target.value)}
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold leading-none">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => {
                    const selected = form.amenities.includes(amenity)

                    return (
                      <button
                        key={amenity}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleAmenity(amenity)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-primary hover:text-primary"
                        )}
                      >
                        {amenity}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="space-y-5 rounded-3xl border border-border bg-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold">Host information</h2>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Host name" error={errors.hostName}>
                  <input
                    className={inputClass}
                    value={userName || ""}
                    disabled
                    onChange={(event) => update("hostName", event.target.value)}
                  />
                </Field>

                <Field label="Contact email">
                  <input
                    className={inputClass}
                    value={userEmail || ""}
                    disabled
                  />
                </Field>
              </div>

              <Field label="Short host bio">
                <textarea
                  className={textareaClass}
                  value={form.hostBio}
                  onChange={(event) => update("hostBio", event.target.value)}
                  placeholder="A line or two about you and how you run the space."
                />
              </Field>
            </section>

            <div className="flex items-center justify-end gap-4">
              {submitted ? (
                <p className="text-sm font-medium text-success">
                  Your studio is live!
                </p>
              ) : null}
              <button type="submit" className={buttonClass}>
                Publish listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
