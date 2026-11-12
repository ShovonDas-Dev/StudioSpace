"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { cn } from "cn"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

const inputClass =
  "h-12 w-full rounded-full border border-input bg-background px-4 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const buttonClass =
  "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()


const handleGoogleLogin = async () => {
  try {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (error) {
      toast.add({
        title: "Google Login Failed",
        description: error.message ?? "Something went wrong.",
        type: "error",
      });
      return;
    }

  } catch (error) {
    console.error("Google Login Error:", error);

    toast.add({
      title: "Login Failed",
      description: "Unable to login with Google. Please try again.",
      type: "error",
    });
  }
};



  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    })
    

    console.log("Signed in successfully:", data)

    if (error) {
      toast.add({
        title: "Log in failed",
        description: error.message ?? "Please check your email and password.",
        type: "error",
      })
      return
    }

    toast.add({
      title: "Logged in",
      description: "Welcome back to StudioSpace.",
      type: "success",
    })
    router.push("/")
  }

  return (
    <section className="container-page py-8 lg:py-14">
      <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] lg:min-h-[560px]">
          <Image
            src="/image/art.jpg"
            alt="Sunlit photography studio with a softbox and white cyc wall"
            fill
            sizes="(min-width: 1024px) 40rem, 100vw"
            preload
            className="object-cover"
          />
          <div className="absolute inset-0 hero-scrim" />
          <div className="relative flex h-full flex-col justify-end p-7 on-image md:p-10">
            <blockquote className="space-y-4">
              <p className="font-display text-2xl leading-snug md:text-3xl">
                &ldquo;I booked a cyc wall at 9pm and was shooting by 10am.
                That&apos;s the whole review.&rdquo;
              </p>
              <cite className="block text-sm not-italic opacity-85">
                &mdash; StudioSpace host community
              </cite>
            </blockquote>
          </div>
        </div>

        <div className="flex flex-col justify-center py-4 lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow text-xs font-bold">Welcome back</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] md:text-5xl">
              Log in to your studio life.
            </h1>

            <div className="mt-8">
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-input bg-background text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
              >
                <GoogleIcon />
                Continue with Google
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
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-foreground"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maya@studiospace.co"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Password
                  </label>
                  {/* <Link
                    href="/login"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                 </Link> */}
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={cn(inputClass, "pr-12")}
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className={buttonClass}>
                Log in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to StudioSpace?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}