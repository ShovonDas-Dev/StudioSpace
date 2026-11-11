"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/Navbar/theme-toggle"
import UserMenu from "@/components/Navbar/user-menu"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore" },
  { href: "/add-studio", label: "Add Studio" },
  { href: "/my-listings", label: "My listings" },
  { href: "/my-bookings", label: "My bookings" },
]

const desktopLinkClass =
  "relative px-1 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform data-[status=active]:after:scale-x-100"

const mobileLinkClass =
  "rounded-xl px-3 py-3 font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"

export function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  )
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="StudioSpace home"
          className="flex items-center gap-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
            S
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        <div className="h-10 w-24" />
      </div>
    </header>
  )
}

function NavbarContent() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)



  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
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

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-status={isActive(link.href) ? "active" : undefined}
              className={desktopLinkClass}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            <UserMenu />
          </div>

          {/* Mobile button and toogler */}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="h-10 w-10 rounded-full text-foreground hover:bg-secondary lg:hidden"
          >
            {isMenuOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-up border-t border-border bg-background lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="container-page flex flex-col py-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-status={isActive(link.href) ? "active" : undefined}
                className={mobileLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex gap-2 border-t border-border pt-4">
              <UserMenu layout="mobile" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
