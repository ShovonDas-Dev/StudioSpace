
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";

import { SafeImage } from "@/components/common/safe-image";

const API_URI = `${process.env.NEXT_PUBLIC_API_URL}/allStudio`;

console.log("API_URI:", API_URI); // Debugging line to check the API URI

const categoryLabels = {
  photography: "Photography",
  film: "Film & Video",
  podcast: "Podcast",
  music: "Music",
  creator: "Creator & Movement",
};

// Section Heading
function SectionHeader() {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="eyebrow">Featured this week</p>
        <h2 className="mt-3 max-w-xl text-4xl font-semibold md:text-5xl">
          Studios creatives keep rebooking
        </h2>
      </div>

      <Link
        href="/studios"
        className="hidden h-11 items-center gap-2 rounded-full border border-input bg-card px-5 text-sm font-semibold hover:text-primary md:inline-flex"
      >
        View all
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// Studio Card
function StudioCard({ studio }) {
  return (
    <Link
      href={`/studios/${studio._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={studio.coverImage || studio.image}
          alt={studio.studioName || studio.title || "Studio"}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
          {categoryLabels[studio.category] || studio.category || "Studio"}
        </span>

        <span className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
          ${studio.hourlyRate || 0}/hr
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold">
            {studio.studioName || studio.title || "Untitled studio"}
          </h3>

          {typeof studio.rating === "number" && (
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {studio.rating.toFixed(1)}
              <span className="text-muted-foreground">
                ({studio.reviewCount || 0})
              </span>
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {studio.location || "Location TBA"}
          </span>

          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Up to {studio.capacity || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Loading Card
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

// Main Component
export default function FeaturedStudio() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch Studio Data
  useEffect(() => {
    const getStudios = async () => {
      try {
        const response = await fetch(API_URI);

        if (!response.ok) {
          throw new Error("Failed to fetch studios");
        }

        const data = await response.json();

        setStudios(Array.isArray(data) ? data.slice(0, 6) : []);

      } catch (err) {
        console.log(err);
        setError(true);

      } finally {
        setLoading(false);
      }
    };

    getStudios();
  }, []);

  return (
    <section className="container-page mt-24">

      <SectionHeader />

      {/* Loading */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="py-16 text-center text-muted-foreground">
          Featured studios are unavailable right now.
        </p>
      )}

      {/* Studio Data */}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}

    </section>
  );
}
