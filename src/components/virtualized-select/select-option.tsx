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
    const { handlePointerOver, handleClick } = React.useMemo(() => {
      if (isDisabled) {
        return {
          handlePointerOver: undefined,
          handleClick: undefined,
        }
      }

      return {
        handlePointerOver: () => handleSetFocusedOptionIndex(index),
        handleClick: () => handleSelectOption(optionValue),
      }
    }, [
      handleSetFocusedOptionIndex,
      handleSelectOption,
      index,
      optionValue,
      isDisabled,
    ])

    return (
      <div
        onMouseOver={handlePointerOver}
        onClick={handleClick}
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
        }}
        data-focused={isFocused}
        data-disabled={isDisabled}
        className="absolute left-0 top-0 flex w-full select-none items-center overflow-hidden px-3 text-sm data-[focused=true]:bg-accent data-[disabled=true]:opacity-50"
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
