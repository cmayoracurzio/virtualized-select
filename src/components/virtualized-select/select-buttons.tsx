import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type SelectButtonsProps = {
  ref: React.RefObject<HTMLDivElement | null>
  isMulti: boolean
  onSelectAll?: () => void
  onClear?: () => void
  isSelectAllDisabled?: boolean
  isClearDisabled?: boolean
}

export const SelectButtons = React.memo(
  ({
    ref,
    isMulti,
    onSelectAll,
    onClear,
    isSelectAllDisabled,
    isClearDisabled,
  }: SelectButtonsProps) => {
    if (isMulti) {
      return (
        <div ref={ref} className="flex items-center p-1">
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={onSelectAll}
            disabled={isSelectAllDisabled}
            aria-label="Select all options"
            className="flex-1 overflow-hidden font-normal select-none"
          >
            <CheckIcon aria-hidden="true" />
            <span className="truncate">Select all</span>
          </Button>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={onClear}
            disabled={isClearDisabled}
            aria-label="Clear selection"
            className="flex-1 overflow-hidden font-normal select-none"
          >
            <XIcon aria-hidden="true" />
            <span className="truncate">Clear all</span>
          </Button>
        </div>
      )
    }

    return (
      <div ref={ref} className="p-1">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={onClear}
          disabled={isClearDisabled}
          aria-label="Clear selection"
          className="w-full overflow-hidden font-normal select-none"
        >
          <XIcon aria-hidden="true" />
          <span className="mr-auto truncate">Clear selection</span>
        </Button>
      </div>
    )
  }
)

SelectButtons.displayName = "SelectButtons"
