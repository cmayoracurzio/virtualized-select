import * as React from "react"

type SelectOptionGroupProps = {
  group: string
  isSticky: boolean
  size: number
  start: number
}

export const SelectOptionGroup = React.memo(
  ({ group, isSticky, size, start }: SelectOptionGroupProps) => {
    return (
      <div
        style={{
          height: `${size}px`,
          transform: isSticky ? undefined : `translateY(${start}px)`,
        }}
        data-sticky={isSticky}
        className="bg-popover text-muted-foreground outline-border top-0 left-0 z-50 flex w-full items-center overflow-hidden px-4 text-xs font-medium outline-1 will-change-transform contain-layout contain-paint select-none data-[sticky=false]:absolute data-[sticky=true]:sticky data-[sticky=true]:shadow-xs"
        role="group"
        aria-label={`Group: ${group}`}
      >
        <span className="truncate">{group}</span>
      </div>
    )
  }
)
SelectOptionGroup.displayName = "SelectOptionGroup"
