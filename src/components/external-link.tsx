import { Button } from "@/components/ui/button"

type ExternalLinkProps = {
  href: string
  children: React.ReactNode
}

export function ExternalLinkButton({ href, children }: ExternalLinkProps) {
  return (
    <Button size="icon" variant="ghost" asChild>
      <a href={href} target="_blank">
        {children}
      </a>
    </Button>
  )
}
