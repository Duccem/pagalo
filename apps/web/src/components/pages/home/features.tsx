"use client";
import { Users, Receipt, Zap, Shield, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/translations/client";

const featureIcons = [Users, Receipt, Zap, Shield, Bell, TrendingUp] as const;

const Features = () => {
  const t = useI18n();
  const features = [
    {
      icon: featureIcons[0],
      title: t("home.features.list.groupExpenses.title"),
      description: t("home.features.list.groupExpenses.description"),
    },
    {
      icon: featureIcons[1],
      title: t("home.features.list.smartSplitting.title"),
      description: t("home.features.list.smartSplitting.description"),
    },
    {
      icon: featureIcons[2],
      title: t("home.features.list.instantSettlements.title"),
      description: t("home.features.list.instantSettlements.description"),
    },
    {
      icon: featureIcons[3],
      title: t("home.features.list.securePrivate.title"),
      description: t("home.features.list.securePrivate.description"),
    },
    {
      icon: featureIcons[4],
      title: t("home.features.list.smartReminders.title"),
      description: t("home.features.list.smartReminders.description"),
    },
    {
      icon: featureIcons[5],
      title: t("home.features.list.expenseInsights.title"),
      description: t("home.features.list.expenseInsights.description"),
    },
  ];
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("home.features.heading.before")}
            <span className="gradient-text">
              {" "}
              {t("home.features.heading.highlight")}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("home.features.subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

