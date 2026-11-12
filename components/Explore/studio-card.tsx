import { SafeImage } from "@/components/common/safe-image";
import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";

import type { Studio } from "@/lib/studios";

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <Link
      href={`/studios/${studio.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <SafeImage
          src={studio.image}
          alt={studio.name}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">
          {studio.categoryLabel}
        </span>

        <span className="absolute bottom-4 right-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
          ${studio.hourlyRate}/hr
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-semibold leading-tight">
            {studio.name}
          </h3>

          <span className="flex shrink-0 items-center gap-1 pt-1 text-sm">
            <Star className="h-4 w-4 fill-primary text-primary" />
            {studio.rating.toFixed(1)}
            <span className="text-muted-foreground">({studio.reviews})</span>
          </span>
        </div>

        <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {studio.location}
          </span>

          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            Up to {studio.capacity}
          </span>
        </div>
      </div>
    </Link>
  );
}
