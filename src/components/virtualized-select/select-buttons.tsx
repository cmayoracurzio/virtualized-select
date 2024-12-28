import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type SelectButtonProps = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "onClick" | "children"
>

const SelectButton = React.memo(
  React.forwardRef<HTMLButtonElement, SelectButtonProps>(
    ({ disabled, onClick, children }, ref) => {
      return (
        <Button
          ref={ref}
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onClick}
          className="w-full select-none overflow-hidden rounded-sm text-sm font-normal"
        >
          {children}
        </Button>
      )
    }
  )
)
SelectButton.displayName = "SelectButton"

type SelectButtonsProps = {
  isMulti: boolean
  onSelectAll?: () => void
  onClear?: () => void
  isSelectAllDisabled?: boolean
  isClearDisabled?: boolean
}

export const SelectButtons = React.memo(
  React.forwardRef<HTMLDivElement, SelectButtonsProps>(
    (
      { isMulti, onSelectAll, onClear, isSelectAllDisabled, isClearDisabled },
      ref
    ) => {
      if (isMulti) {
        return (
          <div ref={ref} className="flex items-center justify-between p-1">
            <SelectButton disabled={isSelectAllDisabled} onClick={onSelectAll}>
              <CheckIcon />
              <span className="truncate">Select all</span>
            </SelectButton>
            <SelectButton disabled={isClearDisabled} onClick={onClear}>
              <XIcon />
              <span className="truncate">Clear all</span>
            </SelectButton>
          </div>
        )
      }

      return (
        <div ref={ref} className="p-1">
          <SelectButton disabled={isClearDisabled} onClick={onClear}>
            <XIcon />
            <span className="mr-auto truncate">Clear selection</span>
          </SelectButton>
        </div>
      )
    }
  )
)
SelectButtons.displayName = "SelectButtons"
