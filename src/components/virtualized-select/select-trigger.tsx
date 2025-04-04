import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"

import { SelectSize } from "./types"

type SelectTriggerProps = {
  isOpen: boolean
  isDisabled: boolean
  label: string
  size?: SelectSize
}

export const SelectTrigger = React.memo(
  ({ isOpen, isDisabled, label, size }: SelectTriggerProps) => {
    return (
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full px-3"
          disabled={isDisabled}
          size={size}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="select-options"
          aria-label="Select dropdown"
        >
          <span className="truncate font-normal">{label}</span>
          <ChevronDownIcon aria-hidden="true" className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"
