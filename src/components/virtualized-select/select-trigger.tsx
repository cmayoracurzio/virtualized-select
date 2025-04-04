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
          aria-expanded={isOpen}
          variant="outline"
          className="w-full px-3"
          disabled={isDisabled}
          size={size}
        >
          <span className="truncate font-normal">{label}</span>
          <ChevronDownIcon className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"
