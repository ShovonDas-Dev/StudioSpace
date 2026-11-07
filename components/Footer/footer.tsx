import Link from "next/link"

function InstagramIcon({ className }: { className?: string }) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
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
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

const socialLinks = [
  { label: "StudioSpace on Instagram", icon: InstagramIcon },
  { label: "StudioSpace on YouTube", icon: YoutubeIcon },
  { label: "StudioSpace on X", icon: TwitterIcon },
]

const columns = [
  {
    title: "Explore",
    links: [
      { label: "All studios", href: "/studios" },
      { label: "Photography", href: "/studios" },
      { label: "Podcast", href: "/studios" },
      { label: "Music", href: "/studios" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { label: "List your studio", href: "/add-studio" },
      { label: "My listings", href: "/my-listings" },
      { label: "Host guarantee", href: "/" },
      { label: "Pricing tips", href: "/" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "My bookings", href: "/my-bookings" },
      { label: "Help center", href: "/" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link
            href="/"
            aria-label="StudioSpace home"
            className="group flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground transition-transform group-hover:rotate-6">
              S
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">
              Studio<span className="text-primary">Space</span>
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The marketplace for creative spaces. Book photo, film, podcast and
            music studios by the hour from hosts who make things too.
          </p>

          <div className="mt-6 flex gap-2">
            {socialLinks.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-sans text-sm font-bold tracking-normal">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>© 2026 StudioSpace Inc. Made for makers.</p>
          <p>Privacy · Terms · Cookie settings</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
