import type { Metadata } from "next"
import { IBM_Plex_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"

import { GitHubLinkButton } from "@/components/github-link"
import { ToggleThemeButton } from "@/components/toggle-theme"

import "@/styles/globals.css"

const font = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const TITLE = "Virtualized Select"

const DESCRIPTION = "A shadcn/ui recipe for handling thousands of options."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${font.className} bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" enableSystem>
          <main className="mx-auto max-w-2xl space-y-12 p-6 pb-12">
            <div className="flex justify-end">
              <ToggleThemeButton />
              <GitHubLinkButton />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">{TITLE}</h1>
              <p className="text-muted-foreground">{DESCRIPTION}</p>
            </div>

            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
