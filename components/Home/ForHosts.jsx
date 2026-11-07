import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Star } from "lucide-react";

const guarantees = [
  "$1M damage protection on every booking",
  "ID-verified renters with public reviews",
  "Payouts within 24 hours of each session",
];

const ForHosts = () => {
  return (
    <section className="container-page mt-24 grid items-center gap-12 lg:grid-cols-2">
      <div className="relative">
        <Image
          src="/image/studio-loft.jpg"
          alt="Sunlit loft studio"
          width={1600}
          height={1200}
          className="aspect-[4/3] w-full rounded-[2rem] object-cover"
        />
        <div className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-card p-4 shadow-lift">
          <img
            src="https://i.pravatar.cc/160?img=47"
            alt="Maya Okafor"
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="flex items-center gap-1 font-semibold">
              Maya Okafor
              <BadgeCheck className="h-4 w-4 text-primary" />
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              Superhost · $48k earned
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="eyebrow">For hosts</p>
        <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
          Your studio, protected by the Host Guarantee.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Turn idle hours into income. Every booking includes up to $1M in
          property damage protection, verified renters and security deposits
          held on your behalf.
        </p>

        <ul className="mt-8 space-y-4">
          {guarantees.map((item) => (
            <li key={item} className="flex items-center gap-3 font-medium">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {item}
            </li>
          ))}
        </ul>

        <Link
          href="/add-studio"
          className="mt-8 inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
        >
          List your studio
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default ForHosts;
