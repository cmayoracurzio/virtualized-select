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
        className="left-0 top-0 z-50 flex w-full select-none items-center overflow-hidden bg-popover px-4 text-xs font-medium text-muted-foreground outline outline-1 outline-border data-[sticky=false]:absolute data-[sticky=true]:sticky data-[sticky=true]:shadow-sm"
      >
        <span className="truncate">{group}</span>
      </div>
    )
  }
)
SelectOptionGroup.displayName = "SelectOptionGroup"
