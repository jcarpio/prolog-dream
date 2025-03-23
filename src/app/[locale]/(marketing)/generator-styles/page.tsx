import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { styles, domainPath } from '@/components/shared/styles';
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { HeaderSection } from "@/components/shared/header-section";
import CTA from "@/components/sections/CTA";
import { unstable_setRequestLocale, getTranslations } from "next-intl/server";

export default async function HeadshotStylePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations("HeadshotStylePage"); // ✅ Fetch translations for the "HeadshotStylePage" section

  return (
    <MaxWidthWrapper className="py-12">
      {/* ✅ Header section with translated content */}
      <HeaderSection
        label={t("label")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* ✅ Grid section for styles */}
      <div className="mt-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {styles.map((style, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={`${domainPath}/${style.img}`}
                    alt={t("headshot.alt", { name: style.prompt })} // ✅ Translated alt attribute
                    className="size-full object-cover"
                  />
                  {style.hot && (
                    <Badge variant="secondary" className="absolute right-2 top-2">
                      {t("headshot.hot")} {/* ✅ Translated "HOT" badge */}
                    </Badge>
                  )}
                  {style.isNew && (
                    <Badge variant="destructive" className="absolute left-2 top-2">
                      {t("headshot.new")} {/* ✅ Translated "NEW" badge */}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-center text-sm font-medium">{style.name}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ✅ Call-to-action section */}
      <CTA />
    </MaxWidthWrapper>
  );
}
