import * as React from "react"
import { CheckIcon } from "lucide-react"

type SelectOptionProps = {
  index: number
  optionValue: string
  optionLabel: string
  isFocused: boolean
  isDisabled: boolean
  isSelected: boolean
  size: number
  start: number
  handleSetFocusedOptionIndex: (index: number) => void
  handleSelectOption: (optionValue: string) => void
}

export const SelectOption = React.memo(
  ({
    index,
    optionValue,
    optionLabel,
    isFocused,
    isDisabled,
    isSelected,
    size,
    start,
    handleSetFocusedOptionIndex,
    handleSelectOption,
  }: SelectOptionProps) => {
    const handlePointerOver = React.useMemo(() => {
      if (isDisabled) {
        return undefined
      }

      return () => handleSetFocusedOptionIndex(index)
    }, [handleSetFocusedOptionIndex, index, isDisabled])

    const handleClick = React.useMemo(() => {
      if (isDisabled) {
        return undefined
      }

      return () => handleSelectOption(optionValue)
    }, [handleSelectOption, isDisabled, optionValue])

    return (
      <div
        onMouseOver={handlePointerOver}
        onClick={handleClick}
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
        }}
        data-focused={isFocused}
        className="absolute left-0 top-0 flex w-full select-none items-center overflow-hidden px-3 text-sm will-change-transform contain-layout contain-paint aria-disabled:opacity-50 data-[focused=true]:bg-accent"
        role="option"
        aria-label={optionLabel}
        aria-selected={isSelected}
        aria-disabled={isDisabled}
      >
        <CheckIcon
          data-selected={isSelected}
          className="mr-2 size-4 shrink-0 data-[selected=false]:opacity-0"
        />
        <span className="truncate">{optionLabel}</span>
      </div>
    )
  }
)
SelectOption.displayName = "SelectOption"
