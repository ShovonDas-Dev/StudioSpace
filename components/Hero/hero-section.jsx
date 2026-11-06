"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const slides = [
  {
    src: "/assets/studio-photo-dRYpf4Lz.jpg",
    alt: "Sunlit photography studio with a large window",
  },
  {
    src: "/assets/studio-podcast-DP95G2Xo.jpg",
    alt: "Podcast studio with microphones and warm lighting",
  },
  {
    src: "/assets/studio-film-DIx5RmEj.jpg",
    alt: "Film studio with a cyc wall and professional lights",
  },
]

const stats = [
  { value: "2,400+", label: "Studios listed" },
  { value: "38k", label: "Sessions booked" },
  { value: "4.9", label: "Average rating" },
  { value: "$1M", label: "Host guarantee" },
]

function SearchIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function ChevronLeftIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 7000)

    return () => clearTimeout(timeout)
  }, [activeSlide])

  function goToPreviousSlide() {
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }

  function goToNextSlide() {
    setActiveSlide((current) => (current + 1) % slides.length)
  }

  return (
    <section className="container-page pt-6">
      <div
        className="relative h-[620px] overflow-hidden rounded-[2rem] md:h-[680px]"
        aria-roledescription="carousel"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === activeSlide ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={index !== activeSlide}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              preload={index === 0}
              loading={index === 0 ? undefined : "eager"}
              className={cn(
                "object-cover transition-transform duration-[7000ms]",
                index === activeSlide ? "scale-105" : "scale-100"
              )}
            />
            <div className="absolute inset-0 hero-scrim" />
          </div>
        ))}

        <div className="relative flex h-full flex-col justify-end p-6 on-image md:p-14">
          <div className="max-w-2xl animate-fade-up">
            <Badge
              variant="outline"
              className="eyebrow block h-auto w-full rounded-none border-0 bg-transparent p-0 text-xs leading-[1.5] font-bold text-primary"
            >
              Photography
            </Badge>
            <h1 className="mt-4 whitespace-pre-line text-5xl font-semibold leading-[1.02] md:text-7xl">
              {"Find the light\nyour work deserves."}
            </h1>
            <p className="mt-5 max-w-lg text-lg opacity-85">
              Daylight lofts, cyc walls and strobe-ready studios from hosts who
              shoot too.
            </p>
          </div>

          <form
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-3xl bg-background p-2 text-foreground shadow-lift sm:flex-row sm:rounded-full"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="flex flex-1 items-center gap-2 px-4">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                aria-label="Search studios"
                placeholder="Try 'cyc wall Brooklyn'"
                className="h-11 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button
              render={<Link href="/studios" />}
              nativeButton={false}
              className="h-13 cursor-pointer gap-2 rounded-full px-8 text-base font-semibold shadow-soft transition-all duration-200 hover:bg-primary hover:shadow-lift hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:scale-[0.98]"
            >
              Find a studio
              <ArrowRightIcon className="size-4" />
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeSlide}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full bg-background transition-all",
                    index === activeSlide ? "w-10 opacity-100" : "w-4 opacity-50"
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={goToPreviousSlide}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-background/30 bg-background/15 on-image backdrop-blur-md transition-all duration-200 hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={goToNextSlide}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-background/30 bg-background/15 on-image backdrop-blur-md transition-all duration-200 hover:bg-background/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card px-5 py-5 text-center shadow-sm transition-shadow hover:shadow-md md:px-6 md:py-6"
          >
            <p className="font-display text-3xl font-semibold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
