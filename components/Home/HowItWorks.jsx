import { CalendarCheck, CreditCard, Search, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description: "Filter by craft, city, price and the gear you actually need.",
    icon: Search,
  },
  {
    number: "02",
    title: "Request",
    description: "Pick a date and hours. Hosts reply in under two hours on average.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Pay securely",
    description: "You're only charged once the host confirms. Deposits are refundable.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Create",
    description: "Show up, make the thing, leave a review. Rebook in one tap.",
    icon: Sparkles,
  },
];

const HowItWorks = () => {
  return (
    <section className="container-page mt-24">
      <div className="rounded-[2rem] bg-ink p-8 text-ink-foreground md:p-14">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-semibold md:text-5xl">
          From idea to on-set in four steps.
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <span className="font-display text-6xl font-bold text-primary/30">
                  {step.number}
                </span>
                <div className="mt-2 grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{step.title}</h3>
                <p className="mt-2 opacity-70">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
