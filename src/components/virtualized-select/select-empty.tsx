import * as React from "react"

type SelectEmptyProps = {
  message: string
}

export const SelectEmpty = React.memo(({ message }: SelectEmptyProps) => {
  return (
    <p className="w-full truncate px-2 py-6 text-center text-sm">{message}</p>
  )
})
SelectEmpty.displayName = "SelectEmpty"
