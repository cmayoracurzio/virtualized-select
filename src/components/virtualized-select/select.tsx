"use client"

import * as React from "react"

import { Popover, PopoverContent } from "@/components/ui/popover"

import { SelectButtons } from "./select-buttons"
import { SelectContent } from "./select-content"
import { SelectTrigger } from "./select-trigger"
import { type SelectProps } from "./types"

export function Select<Option>({
  options,
  isMulti,
  selection,
  onSelectionChange,
  getOptionValue,
  getOptionLabel,
  getOptionGroup,
  isOptionDisabled,
  noOptionsMessage,
  isDisabled = false,
  closeOnChange = false,
  forceSelection = false,
  initialFocusOnFirstOption,
  stickyGroups,
  enableSearch,
  searchPlaceholder,
  searchDebounceMilliseconds,
  enableSelectionOptions = false,
  getOptionSize,
  defaultOptionSize,
  getOptionGroupSize,
  defaultOptionGroupSize,
  gap,
  overscan,
  loop,
}: SelectProps<Option>) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const popoverContentRef = React.useRef<HTMLDivElement>(null)
  const selectionOptionsRef = React.useRef<HTMLDivElement>(null)

  // Selection
  const effectiveGetOptionLabel = React.useMemo(
    () => getOptionLabel ?? getOptionValue,
    [getOptionLabel, getOptionValue]
  )

  const effectiveIsOptionDisabled = React.useMemo(
    () => isOptionDisabled ?? (() => false),
    [isOptionDisabled]
  )

  const { enabledOptionValues, optionValueToLabel } = React.useMemo(() => {
    const enabledValues: string[] = []
    const labelMap = new Map<string, string>()

    for (const option of options) {
      const value = getOptionValue(option)
      labelMap.set(value, effectiveGetOptionLabel(option))

      if (!effectiveIsOptionDisabled(option)) {
        enabledValues.push(value)
      }
    }

    return {
      enabledOptionValues: enabledValues,
      optionValueToLabel: labelMap,
    }
  }, [
    effectiveGetOptionLabel,
    effectiveIsOptionDisabled,
    getOptionValue,
    options,
  ])

  const {
    isOptionSelected,
    handleSelectOption,
    isClearDisabled,
    handleClear,
    isSelectAllDisabled,
    handleSelectAll,
  } = React.useMemo(() => {
    if (isMulti) {
      const selectionSet = new Set(selection)

      const setSelection = closeOnChange
        ? (newSelection: string[]) => {
            onSelectionChange(newSelection)
            setIsOpen(false)
          }
        : (newSelection: string[]) => {
            onSelectionChange(newSelection)
            popoverContentRef.current?.focus()
          }

      let isSelectAllDisabled = !enableSelectionOptions || options.length === 0

      if (enabledOptionValues.length > selectionSet.size) {
        isSelectAllDisabled = false
      } else if (!isSelectAllDisabled) {
        isSelectAllDisabled = true

        for (const option of enabledOptionValues) {
          if (!selectionSet.has(option)) {
            isSelectAllDisabled = false
            break
          }
        }
      }

      return {
        isOptionSelected(optionValue: string) {
          return selectionSet.has(optionValue)
        },
        handleSelectOption: forceSelection
          ? (optionValue: string) => {
              if (isOptionSelected(optionValue)) {
                if (selectionSet.size > 1) {
                  const newSelection = new Set(selectionSet)
                  newSelection.delete(optionValue)
                  setSelection([...newSelection])
                }
              } else {
                setSelection([...selection, optionValue])
              }
            }
          : (optionValue: string) => {
              if (isOptionSelected(optionValue)) {
                const newSelection = new Set(selectionSet)
                newSelection.delete(optionValue)
                setSelection([...newSelection])
              } else {
                setSelection([...selection, optionValue])
              }
            },
        isClearDisabled:
          !enableSelectionOptions ||
          forceSelection ||
          selectionSet.size === 0 ||
          options.length === 0,
        handleClear() {
          setSelection([])
        },
        isSelectAllDisabled,
        handleSelectAll() {
          setSelection(enabledOptionValues)
        },
      }
    }

    const setSelection = closeOnChange
      ? (newSelection: string | null) => {
          onSelectionChange(newSelection)
          setIsOpen(false)
        }
      : (newSelection: string | null) => {
          onSelectionChange(newSelection)
          popoverContentRef.current?.focus()
        }

    return {
      isOptionSelected(optionValue: string) {
        return selection === optionValue
      },
      handleSelectOption: forceSelection
        ? (optionValue: string) => {
            if (!isOptionSelected(optionValue)) {
              setSelection(optionValue)
            }
          }
        : (optionValue: string) => {
            const newSelection = isOptionSelected(optionValue)
              ? null
              : optionValue
            setSelection(newSelection)
          },
      isClearDisabled:
        !enableSelectionOptions ||
        forceSelection ||
        selection === null ||
        options.length === 0,
      handleClear() {
        setSelection(null)
      },
    }
  }, [
    closeOnChange,
    enableSelectionOptions,
    enabledOptionValues,
    forceSelection,
    isMulti,
    options.length,
    onSelectionChange,
    selection,
  ])

  // Trigger label
  const triggerLabel = React.useMemo(() => {
    if (isMulti) {
      switch (selection.length) {
        case 0:
          return "Select options..."
        case 1:
          return optionValueToLabel.get(selection[0]) ?? selection[0]
        default:
          return `${selection.length} options selected`
      }
    } else {
      return selection
        ? (optionValueToLabel.get(selection) ?? selection)
        : "Select an option..."
    }
  }, [isMulti, selection, optionValueToLabel])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger
        isOpen={isOpen}
        isDisabled={isDisabled}
        label={triggerLabel}
      />
      <PopoverContent
        ref={popoverContentRef}
        className="w-[var(--radix-popover-trigger-width)] divide-y overflow-hidden p-0"
      >
        <SelectContent<Option>
          options={options}
          getOptionValue={getOptionValue}
          noOptionsMessage={noOptionsMessage}
          enableSearch={enableSearch}
          searchPlaceholder={searchPlaceholder}
          searchDebounceMilliseconds={searchDebounceMilliseconds}
          initialFocusOnFirstOption={initialFocusOnFirstOption}
          stickyGroups={stickyGroups}
          getOptionGroup={getOptionGroup}
          getOptionSize={getOptionSize}
          defaultOptionSize={defaultOptionSize}
          getOptionGroupSize={getOptionGroupSize}
          defaultOptionGroupSize={defaultOptionGroupSize}
          gap={gap}
          overscan={overscan}
          loop={loop}
          getOptionLabel={effectiveGetOptionLabel}
          isOptionDisabled={effectiveIsOptionDisabled}
          isOptionSelected={isOptionSelected}
          handleSelectOption={handleSelectOption}
          popoverContentRef={popoverContentRef}
          selectionOptionsRef={selectionOptionsRef}
        />
        {enableSelectionOptions && (
          <SelectButtons
            ref={selectionOptionsRef}
            isMulti={isMulti}
            onSelectAll={handleSelectAll}
            onClear={handleClear}
            isSelectAllDisabled={isSelectAllDisabled}
            isClearDisabled={isClearDisabled}
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
