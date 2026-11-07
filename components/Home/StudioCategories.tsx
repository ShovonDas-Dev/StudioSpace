import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Category = {
  id: string
  title: string
  blurb: string
  image: string
}

const categories: Category[] = [
  {
    id: "photography",
    title: "Photography",
    blurb: "Cyc walls, daylight lofts & strobes",
    image: "/assets/studio-photo-dRYpf4Lz.jpg",
  },
  {
    id: "film",
    title: "Film & Video",
    blurb: "Soundstages, grip & lighting packages",
    image: "/assets/studio-film-DIx5RmEj.jpg",
  },
  {
    id: "podcast",
    title: "Podcast",
    blurb: "Treated rooms with broadcast mics",
    image: "/assets/studio-podcast-DP95G2Xo.jpg",
  },
  {
    id: "music",
    title: "Music",
    blurb: "Control rooms, live rooms & booths",
    image: "/image/studio-music.jpg",
  },
  {
    id: "creator",
    title: "Creator & Movement",
    blurb: "Content sets, dance & rehearsal halls",
    image: "/image/studio-content.jpg",
  },
]

const cardScrim =
  "linear-gradient(rgba(0, 0, 0, 0) 50%, oklch(12% 0.01 60 / 0.55) 100%)"

export default function StudioCategories() {
  return (
    <section className="container-page mt-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Browse by craft</p>
          <h2 className="mt-3 max-w-xl text-4xl font-semibold md:text-5xl">
            A room for every kind of making
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/studios?category=${category.id}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl"
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0" style={{ background: cardScrim }} />
            <div className="absolute inset-x-0 bottom-0 p-5 on-image">
              <h3 className="text-2xl font-semibold">{category.title}</h3>
              <p className="mt-1 text-sm opacity-80">{category.blurb}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                Explore
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
