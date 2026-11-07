import Link from "next/link"

function LockIcon({ className }: { className?: string }) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function BlockRoute() {
  return (
    <div className="container-page py-20">
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground animate-float [&_svg]:h-7 [&_svg]:w-7">
          <LockIcon />
        </div>

        <h3 className="mt-6 text-2xl font-semibold">Sign in to continue</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Your dashboard keeps your listings and bookings in one place. Log in
          to see it.
        </p>

        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.98]"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlockRoute
