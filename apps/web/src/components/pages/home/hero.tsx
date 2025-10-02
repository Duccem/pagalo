"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/translations/client";

const Hero = () => {
  const t = useI18n();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_hsl(142_81%_59%_/_0.15)_0%,_transparent_50%)]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(0_0%_15%_/_0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_15%_/_0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Logo */}
          <div className="animate-fade-in">
            <img
              src={"/logo-green.png"}
              alt={t("home.hero.logoAlt")}
              className="w-32  md:w-28  drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]"
            />
          </div>

          {/* Heading */}
          <div
            className="space-y-4 max-w-4xl animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t("home.hero.title.before")}{" "}
              <span className="gradient-text">
                {t("home.hero.title.highlight")}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("home.hero.description")}
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            <Button size="lg" variant="hero" className="text-base gap-2">
              {t("home.hero.buttons.getStarted")}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              {t("home.hero.buttons.watchDemo")}
            </Button>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-8 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.3s", animationFillMode: "both" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              <span>{t("home.hero.social.trustedBy")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

