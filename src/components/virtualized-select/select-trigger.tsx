import * as React from "react"
import { ChevronDownIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"

import { SelectSize } from "./types"

type SelectTriggerProps = {
  size: SelectSize
  isOpen: boolean
  isLoading: boolean
  isDisabled: boolean
  label: string
  loadingMessage: string
}

export const SelectTrigger = React.memo(
  ({
    size,
    isOpen,
    isLoading,
    isDisabled,
    label,
    loadingMessage,
  }: SelectTriggerProps) => {
    return (
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isDisabled || isLoading}
          size={size}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="select-options"
          aria-label="Select dropdown"
        >
          {isLoading ? (
            <>
              <span className="truncate font-normal">{loadingMessage}</span>
              <Loader2Icon className="ml-auto opacity-50 motion-safe:animate-spin" />
            </>
          ) : (
            <>
              <span className="truncate font-normal">{label}</span>
              <ChevronDownIcon
                aria-hidden="true"
                className="ml-auto opacity-50"
              />
            </>
          )}
        </Button>
      </PopoverTrigger>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"
