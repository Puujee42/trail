"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/i18n-config";

const MobileBottomNav = dynamic(() => import("./MobileBottomNav"), {
  ssr: false,
});

export default function MobileBottomNavNoSSR({
  language,
  dictionary,
}: {
  language: Locale;
  dictionary: any;
}) {
  return <MobileBottomNav language={language} dictionary={dictionary} />;
}

