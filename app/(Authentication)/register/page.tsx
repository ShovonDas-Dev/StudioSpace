"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "cn"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

const inputClass =
  "h-12 w-full rounded-full border border-input bg-background px-4 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const buttonClass =
  "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"

const requirements = [
  { id: "length", label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { id: "uppercase", label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { id: "lowercase", label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
]

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.56 11.56 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}

export default function RegisterPage() {
  const [password, setPassword] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  })



  console.log(formData)

  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { data, error } = await authClient.signUp.email({
      name: formData.name,
      email: formData.email,
      image: formData.image,
      password: formData.password,
    })

    console.log("Sign-up response:", { data, error })

    if (error) {
      toast.add({
        title: "Sign up failed",
        description: error.message ?? "Please check your details and try again.",
        type: "error",
      })
      return
    }
    
    toast.add({
      title: "Account created",
      description: "Welcome to StudioSpace.",
      type: "success",
    })
    router.push("/")
  }

  return (
    <section className="container-page py-8 lg:py-14">
      <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] lg:min-h-[560px]">
          <Image
            src="/image/Microphone.jpg"
            alt="Warmly lit music studio with a mixing console and studio monitors"
            fill
            sizes="(min-width: 1024px) 40rem, 100vw"
            preload
            className="object-cover"
          />
          <div className="absolute inset-0 hero-scrim" />
          <div className="relative flex h-full flex-col justify-end p-7 on-image md:p-10">
            <blockquote className="space-y-4">
              <p className="font-display text-2xl leading-snug md:text-3xl">
                &ldquo;Hosting paid off my console in five months. The guarantee
                means I actually sleep.&rdquo;
              </p>
              <cite className="block text-sm not-italic opacity-85">
                &mdash; StudioSpace host community
              </cite>
            </blockquote>
          </div>
        </div>

        <div className="flex flex-col justify-center py-4 lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow text-xs font-bold">Join StudioSpace</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] md:text-5xl">
              Make your next thing somewhere great.
            </h1>

            <div className="mt-8">
              <button
                type="button"
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-input bg-background text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
              >
                <GoogleIcon />
                Sign up with Google
              </button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>or with email</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="register-name"
                  className="block text-sm font-semibold text-foreground"
                >
                  Full name
                </label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  value={formData.name}
                  placeholder="Maya Okafor"
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="register-email"
                  className="block text-sm font-semibold text-foreground"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  value={formData.email}
                  placeholder="you@studio.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="register-photo-url"
                  className="block text-sm font-semibold text-foreground"
                >
                  Photo URL{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="register-photo-url"
                  name="image"
                  onChange={(event) => setFormData({ ...formData, image: event.target.value })}
                    value={formData.image}
                  type="url"
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="register-password"
                  className="block text-sm font-semibold text-foreground"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setFormData({ ...formData, password: event.target.value })
                  }}
                    value={formData.password}
                    placeholder="••••••••"
                  autoComplete="new-password"
                 className={inputClass}
                  
                />
                <ul className="flex flex-wrap gap-x-5 gap-y-1 pt-1">
                  {requirements.map((requirement) => {
                    const met = requirement.test(password)

                    return (
                      <li
                        key={requirement.id}
                        className={cn(
                          "flex items-center gap-1.5 text-xs transition-colors",
                          met
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {met ? (
                          <CheckIcon className="size-3 text-primary" />
                        ) : (
                          <XIcon className="size-3" />
                        )}
                        {requirement.label}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <button type="submit" className={buttonClass}>
                Create account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
