"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/translations/client";

const CTA = () => {
  const t = useI18n();
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-12 md:p-16 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_hsl(142_81%_59%_/_0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_15%_/_0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_15%_/_0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {t("home.cta.title.before")}{" "}
              <span className="gradient-text">
                {t("home.cta.title.highlight")}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("home.cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="hero" className="text-base gap-2">
                {t("home.cta.buttons.downloadNow")}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base">
                {t("home.cta.buttons.learnMore")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("home.cta.note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

