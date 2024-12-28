import * as React from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

type SelectSearchProps = {
  onSearch: (search: string) => void
  placeholder: string
  disabled: boolean
}

export const SelectSearch = React.memo(
  ({ onSearch, placeholder, disabled }: SelectSearchProps) => {
    return (
      <div className="flex items-center px-3">
        <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
        <Input
          onChange={(event) => onSearch(event.target.value)}
          placeholder={placeholder}
          className="h-10 border-0 px-0 shadow-none outline-none focus-visible:ring-0 disabled:pointer-events-none"
          disabled={disabled}
        />
      </div>
    )
  }
)
SelectSearch.displayName = "SelectSearch"
