import * as React from "react"
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type SelectSearchProps = {
  onSearch: (search: string) => void
  placeholder: string
  disabled: boolean
}

export const SelectSearch = React.memo(
  ({ onSearch, placeholder, disabled }: SelectSearchProps) => {
    return (
      <InputGroup
        role="search"
        className="border-border! rounded-none border-t-0 border-r-0 border-l-0 shadow-none ring-0! dark:bg-transparent"
      >
        <InputGroupAddon align="inline-start">
          <SearchIcon aria-hidden="true" className="shrink-0" />
        </InputGroupAddon>
        <InputGroupInput
          role="searchbox"
          aria-label="Search options"
          aria-controls="select-options"
          onChange={(event) => onSearch(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </InputGroup>
    )
  }
)
SelectSearch.displayName = "SelectSearch"
