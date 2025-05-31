import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type SelectButtonProps = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "onClick" | "children"
>

const SelectButton = ({ disabled, onClick, children }: SelectButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="flex-1 overflow-hidden rounded-xs text-sm font-normal select-none"
    >
      {children}
    </Button>
  )
}

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
        <div ref={ref} className="flex items-center justify-between p-1">
          <SelectButton
            disabled={isSelectAllDisabled}
            onClick={onSelectAll}
            aria-label="Select all options"
          >
            <CheckIcon aria-hidden="true" />
            <span className="truncate">Select all</span>
          </SelectButton>
          <SelectButton
            disabled={isClearDisabled}
            onClick={onClear}
            aria-label="Clear selection"
          >
            <XIcon aria-hidden="true" />
            <span className="truncate">Clear all</span>
          </SelectButton>
        </div>
      )
    }

    return (
      <div ref={ref} className="p-1">
        <SelectButton
          disabled={isClearDisabled}
          onClick={onClear}
          aria-label="Clear selection"
        >
          <XIcon aria-hidden="true" />
          <span className="mr-auto truncate">Clear selection</span>
        </SelectButton>
      </div>
    )
  }
)

SelectButtons.displayName = "SelectButtons"
