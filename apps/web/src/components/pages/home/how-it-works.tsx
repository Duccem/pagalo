"use client";
import { PlusCircle, Users2, DollarSign } from "lucide-react";
import { useI18n } from "@/lib/translations/client";
const stepIcons = [PlusCircle, Users2, DollarSign] as const;

const HowItWorks = () => {
  const t = useI18n();
  const steps = [
    {
      icon: stepIcons[0],
      title: t("home.howItWorks.steps.createExpense.title"),
      description: t("home.howItWorks.steps.createExpense.description"),
    },
    {
      icon: stepIcons[1],
      title: t("home.howItWorks.steps.chooseWhoPays.title"),
      description: t("home.howItWorks.steps.chooseWhoPays.description"),
    },
    {
      icon: stepIcons[2],
      title: t("home.howItWorks.steps.settleUp.title"),
      description: t("home.howItWorks.steps.settleUp.description"),
    },
  ];
  return (
    <section className="py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(142_81%_59%_/_0.05)_0%,_transparent_50%)]" />

      <div className="container px-4 md:px-6 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("home.howItWorks.heading")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("home.howItWorks.subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.title} className="relative">
              <div className="relative flex flex-col items-center text-center space-y-4 p-6">
                {/* Step number */}

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

