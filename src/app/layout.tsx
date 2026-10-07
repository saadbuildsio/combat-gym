import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageGate } from "@/components/language-picker";
import { PlanProvider } from "@/components/plan-provider";
import { ProfileProvider } from "@/components/profile-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Combat Gym",
  description: "Learn boxing from home: train, get scored, level up.",
};

export const viewport: Viewport = {
  themeColor: "#0b0d10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <LanguageGate>
            <ProfileProvider>
              <PlanProvider>{children}</PlanProvider>
            </ProfileProvider>
          </LanguageGate>
        </LanguageProvider>
      </body>
    </html>
  );
}
