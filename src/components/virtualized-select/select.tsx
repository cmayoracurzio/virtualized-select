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
  defaultSelection,
  onSelectionChange,
  getOptionValue,
  getOptionLabel,
  getOptionGroup,
  isOptionDisabled,
  size = "default",
  noOptionsMessage = "No options found.",
  isDisabled = false,
  closeOnChange = false,
  forceSelection = false,
  initialFocusOnFirstOption = false,
  stickyGroups = false,
  enableSearch = false,
  searchPlaceholder = "Search options...",
  searchDebounceMilliseconds = 200,
  enableSelectionOptions = false,
  getOptionSize,
  defaultOptionSize = 36,
  getOptionGroupSize,
  defaultOptionGroupSize = 28,
  gap,
  overscan,
  loop = false,
}: SelectProps<Option>) {
  // General
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const popoverContentRef = React.useRef<HTMLDivElement>(null)
  const selectionOptionsRef = React.useRef<HTMLDivElement>(null)

  // Options
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

  // Selection
  const [uncontrolledSingleSelection, setUncontrolledSingleSelection] =
    React.useState<string | null>(
      isMulti
        ? null
        : selection !== undefined
          ? selection
          : defaultSelection !== undefined
            ? defaultSelection
            : null
    )
  const [uncontrolledMultiSelection, setUncontrolledMultiSelection] =
    React.useState<string[]>(
      !isMulti
        ? []
        : selection !== undefined
          ? selection
          : defaultSelection !== undefined
            ? defaultSelection
            : []
    )

  const {
    isOptionSelected,
    handleSelectOption,
    isClearDisabled,
    handleClear,
    isSelectAllDisabled,
    handleSelectAll,
  } = React.useMemo(() => {
    if (isMulti) {
      const isControlled = selection !== undefined
      const effectiveSelection = isControlled
        ? selection
        : uncontrolledMultiSelection

      const selectionSet = new Set(effectiveSelection)

      const handleSelectionChange = closeOnChange
        ? (newSelection: string[]) => {
            onSelectionChange?.(newSelection)
            setUncontrolledMultiSelection(newSelection)
            setIsOpen(false)
          }
        : (newSelection: string[]) => {
            onSelectionChange?.(newSelection)
            setUncontrolledMultiSelection(newSelection)
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
                  handleSelectionChange([...newSelection])
                }
              } else {
                handleSelectionChange([...effectiveSelection, optionValue])
              }
            }
          : (optionValue: string) => {
              if (isOptionSelected(optionValue)) {
                const newSelection = new Set(selectionSet)
                newSelection.delete(optionValue)
                handleSelectionChange([...newSelection])
              } else {
                handleSelectionChange([...effectiveSelection, optionValue])
              }
            },
        isClearDisabled:
          !enableSelectionOptions ||
          forceSelection ||
          selectionSet.size === 0 ||
          options.length === 0,
        handleClear() {
          handleSelectionChange([])
        },
        isSelectAllDisabled,
        handleSelectAll() {
          handleSelectionChange(enabledOptionValues)
        },
      }
    } else {
      const effectiveSelection =
        selection !== undefined ? selection : uncontrolledSingleSelection

      const handleSelectionChange = closeOnChange
        ? (newSelection: string | null) => {
            onSelectionChange?.(newSelection)
            setUncontrolledSingleSelection(newSelection)
            setIsOpen(false)
          }
        : (newSelection: string | null) => {
            onSelectionChange?.(newSelection)
            setUncontrolledSingleSelection(newSelection)
            popoverContentRef.current?.focus()
          }

      return {
        isOptionSelected(optionValue: string) {
          return effectiveSelection === optionValue
        },
        handleSelectOption: forceSelection
          ? (optionValue: string) => {
              if (!isOptionSelected(optionValue)) {
                handleSelectionChange(optionValue)
              }
            }
          : (optionValue: string) => {
              const newSelection = isOptionSelected(optionValue)
                ? null
                : optionValue
              handleSelectionChange(newSelection)
            },
        isClearDisabled:
          !enableSelectionOptions ||
          forceSelection ||
          effectiveSelection === null ||
          options.length === 0,
        handleClear() {
          handleSelectionChange(null)
        },
      }
    }
  }, [
    closeOnChange,
    enableSelectionOptions,
    enabledOptionValues,
    forceSelection,
    isMulti,
    onSelectionChange,
    options.length,
    selection,
    uncontrolledMultiSelection,
    uncontrolledSingleSelection,
  ])

  // Trigger label
  const triggerLabel = React.useMemo(() => {
    if (isMulti) {
      const effectiveSelection =
        selection !== undefined ? selection : uncontrolledMultiSelection

      switch (effectiveSelection.length) {
        case 0:
          return "Select options..."
        case 1:
          return (
            optionValueToLabel.get(effectiveSelection[0]) ??
            effectiveSelection[0]
          )
        default:
          return `${effectiveSelection.length} options selected`
      }
    } else {
      const effectiveSelection =
        selection !== undefined ? selection : uncontrolledSingleSelection

      switch (effectiveSelection) {
        case null:
          return "Select an option..."
        default:
          return (
            optionValueToLabel.get(effectiveSelection) ?? effectiveSelection
          )
      }
    }
  }, [
    isMulti,
    optionValueToLabel,
    selection,
    uncontrolledMultiSelection,
    uncontrolledSingleSelection,
  ])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger
        isOpen={isOpen}
        isDisabled={isDisabled}
        label={triggerLabel}
        size={size}
      />
      <PopoverContent
        ref={popoverContentRef}
        className="w-[var(--radix-popover-trigger-width)] divide-y overflow-hidden p-0"
        id="select-options"
        role="listbox"
        aria-multiselectable={isMulti}
        aria-label="Select dropdown options"
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
