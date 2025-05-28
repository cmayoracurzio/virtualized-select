import type { Metadata } from "next"
import { IBM_Plex_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"

import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants"
import { GitHubLinkButton } from "@/components/github-link"
import { ToggleThemeButton } from "@/components/toggle-theme"

import "@/app/globals.css"

const font = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
})
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" enableSystem>
          <main className="mx-auto max-w-2xl space-y-6 p-6">
            <div className="flex justify-end">
              <ToggleThemeButton />
              <GitHubLinkButton />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter">
                {SITE_TITLE}
              </h1>
              <p className="text-muted-foreground">{SITE_DESCRIPTION}</p>
            </div>

            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
