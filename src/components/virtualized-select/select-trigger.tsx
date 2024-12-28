import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PopoverTrigger } from "@/components/ui/popover"

type SelectTriggerProps = {
  isOpen: boolean
  isDisabled: boolean
  label: string
}

export const SelectTrigger = React.memo(
  ({ isOpen, isDisabled, label }: SelectTriggerProps) => {
    return (
      <PopoverTrigger asChild>
        <Button
          type="button"
          aria-expanded={isOpen}
          variant="outline"
          className="w-full px-3"
          disabled={isDisabled}
        >
          <span className="truncate font-normal">{label}</span>
          <ChevronDownIcon className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"
