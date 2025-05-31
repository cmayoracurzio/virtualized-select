import * as React from "react"
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
} from "@tanstack/react-virtual"

import { SelectOptionGroup } from "./select-group"
import { SelectOption } from "./select-option"
import { SelectSearch } from "./select-search"
import { type SelectProps } from "./types"

// TODO: Add commentary about why select-content is a separate component from select

type SelectContentProps<Option> = Required<
  Pick<
    SelectProps<Option>,
    | "options"
    | "getOptionValue"
    | "getOptionLabel"
    | "isOptionDisabled"
    | "minHeight"
    | "maxHeight"
    | "noOptionsMessage"
    | "enableSearch"
    | "searchPlaceholder"
    | "searchDebounceMilliseconds"
    | "initialFocusOnFirstOption"
    | "stickyGroups"
    | "defaultOptionSize"
    | "defaultOptionGroupSize"
    | "loop"
  >
> &
  Pick<
    SelectProps<Option>,
    | "getOptionGroup"
    | "getOptionSize"
    | "getOptionGroupSize"
    | "gap"
    | "overscan"
  > & {
    isOptionSelected: (optionValue: string) => boolean
    handleSelectOption: (optionValue: string) => void
    popoverContentRef: React.RefObject<HTMLDivElement | null>
    selectionOptionsRef: React.RefObject<HTMLDivElement | null>
  }

export const SelectContent = <Option,>({
  options,
  getOptionValue,
  minHeight,
  maxHeight,
  noOptionsMessage,
  initialFocusOnFirstOption,
  stickyGroups,
  enableSearch,
  searchPlaceholder,
  searchDebounceMilliseconds,
  getOptionGroup,
  getOptionSize,
  defaultOptionSize,
  getOptionGroupSize,
  defaultOptionGroupSize,
  gap,
  overscan,
  loop,
  getOptionLabel,
  isOptionDisabled,
  isOptionSelected,
  handleSelectOption,
  popoverContentRef,
  selectionOptionsRef,
}: SelectContentProps<Option>) => {
  // Options

  const [search, setSearch] = React.useState<string>("")

  const filteredOptions = React.useMemo(() => {
    const formattedSearch = search.trim().toLowerCase()

    if (formattedSearch === "") {
      return options
    }

    return options.filter((option) =>
      getOptionLabel(option).trim().toLowerCase().includes(formattedSearch)
    )
  }, [getOptionLabel, options, search])

  const { effectiveOptions, optionGroupIndexes } = React.useMemo(() => {
    if (getOptionGroup === undefined) {
      return {
        effectiveOptions: filteredOptions,
        optionGroupIndexes: [],
      }
    }

    const effectiveOptions: Array<Option | string> = []
    const optionGroupIndexes: number[] = []

    Map.groupBy(filteredOptions, getOptionGroup).forEach(
      (groupOptions, group) => {
        optionGroupIndexes.push(effectiveOptions.length)
        effectiveOptions.push(group, ...groupOptions)
      }
    )

    return { effectiveOptions, optionGroupIndexes }
  }, [getOptionGroup, filteredOptions])

  const isOptionGroup = React.useCallback(
    (index: number) => optionGroupIndexes.includes(index),
    [optionGroupIndexes]
  )

  // Virtualization

  const effectiveGetOptionGroupSize = React.useMemo(
    () => getOptionGroupSize ?? (() => defaultOptionGroupSize),
    [defaultOptionGroupSize, getOptionGroupSize]
  )

  const effectiveGetOptionSize = React.useMemo(
    () => getOptionSize ?? (() => defaultOptionSize),
    [defaultOptionSize, getOptionSize]
  )

  const estimateSize = React.useCallback(
    (index: number) => {
      if (isOptionGroup(index)) {
        const group = effectiveOptions[index] as string
        return effectiveGetOptionGroupSize(group)
      }

      const option = effectiveOptions[index] as Option
      return effectiveGetOptionSize(option)
    },
    [
      effectiveGetOptionGroupSize,
      effectiveGetOptionSize,
      effectiveOptions,
      isOptionGroup,
    ]
  )

  const activeOptionGroupIndexRef = React.useRef<number>(-1)

  const rangeExtractor = React.useMemo(() => {
    if (getOptionGroup === undefined || !stickyGroups) {
      return undefined
    }

    return (range: Range) => {
      activeOptionGroupIndexRef.current =
        optionGroupIndexes.findLast((index) => range.startIndex >= index) ?? 0

      const next = new Set([
        activeOptionGroupIndexRef.current,
        ...defaultRangeExtractor(range),
      ])

      return [...next].sort((a, b) => a - b)
    }
  }, [getOptionGroup, optionGroupIndexes, stickyGroups])

  const scrollElementRef = React.useRef<HTMLDivElement>(null)

  const getScrollElement = React.useCallback(() => scrollElementRef.current, [])

  const virtualizer = useVirtualizer({
    count: effectiveOptions.length,
    getScrollElement,
    estimateSize,
    gap,
    overscan,
    rangeExtractor,
  })

  // Focus

  const initialFocusedOptionIndex = React.useMemo(() => {
    if (!initialFocusOnFirstOption) {
      return -1
    }

    return getOptionGroup === undefined ? 0 : 1
  }, [initialFocusOnFirstOption, getOptionGroup])

  const focusedOptionIndexRef = React.useRef<number>(initialFocusedOptionIndex)
  const [focusedOptionIndex, setFocusedOptionIndex] = React.useState<number>(
    initialFocusedOptionIndex
  )

  const handleSetFocusedOptionIndex = React.useCallback(
    (index: number) => {
      focusedOptionIndexRef.current = index
      setFocusedOptionIndex(index)
    },
    [focusedOptionIndexRef, setFocusedOptionIndex]
  )

  // Keyboard navigation

  const getNextValidOptionIndex = React.useCallback(
    (currentIndex: number, direction: "up" | "down"): number => {
      let nextIndex = currentIndex
      const increment = direction === "down" ? 1 : -1
      const lastIndex = effectiveOptions.length - 1

      // Helper function to check if an index is valid
      const isValidIndex = (index: number): boolean => {
        if (index < 0 || index > lastIndex) {
          return false
        }

        if (isOptionGroup(index)) {
          return false
        }

        return !isOptionDisabled(effectiveOptions[index] as Option)
      }

      // Special handling for initial -1 index when not looping
      if (!loop && currentIndex === -1) {
        // When moving up, start from the last valid option
        if (direction === "up") {
          nextIndex = lastIndex
        }
        // When moving down, start from the first option
        else {
          nextIndex = 0
        }
      } else {
        nextIndex += increment
      }

      // Handle looping and bounds
      if (loop) {
        if (nextIndex > lastIndex) {
          nextIndex = 0
        } else if (nextIndex < 0) {
          nextIndex = lastIndex
        }
      } else {
        if (nextIndex > lastIndex || nextIndex < 0) {
          return currentIndex
        }
      }

      // Find next valid index
      while (!isValidIndex(nextIndex)) {
        if (loop) {
          nextIndex += increment
          if (nextIndex > lastIndex) {
            nextIndex = 0
          } else if (nextIndex < 0) {
            nextIndex = lastIndex
          }
        } else {
          nextIndex += increment
          if (nextIndex > lastIndex || nextIndex < 0) {
            return currentIndex
          }
        }

        // If we've checked all possible indices and found nothing valid, return current
        if (nextIndex === currentIndex) {
          return currentIndex
        }
      }

      return nextIndex
    },
    [isOptionDisabled, effectiveOptions, isOptionGroup, loop]
  )

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      const { key, shiftKey, altKey, ctrlKey, metaKey } = event

      if (
        effectiveOptions.length === 0 ||
        shiftKey ||
        altKey ||
        ctrlKey ||
        metaKey
      ) {
        return
      }

      const currentIndex = focusedOptionIndexRef.current

      switch (key) {
        case "ArrowDown":
          event.preventDefault()
          const nextIndex = getNextValidOptionIndex(currentIndex, "down")
          handleSetFocusedOptionIndex(nextIndex)
          virtualizer.scrollToIndex(nextIndex)
          break
        case "ArrowUp":
          event.preventDefault()
          const prevIndex = getNextValidOptionIndex(currentIndex, "up")
          handleSetFocusedOptionIndex(prevIndex)
          virtualizer.scrollToIndex(prevIndex)
          break
        case "Enter":
          if (
            currentIndex === -1 ||
            selectionOptionsRef.current?.contains(document.activeElement)
          ) {
            break
          }

          const selectedOption = effectiveOptions[currentIndex] as Option

          if (!isOptionDisabled(selectedOption)) {
            event.preventDefault()
            const selectedOptionValue = getOptionValue(selectedOption)
            handleSelectOption(selectedOptionValue)
          }
          break
        default:
          break
      }
    },
    [
      effectiveOptions,
      getNextValidOptionIndex,
      getOptionValue,
      handleSelectOption,
      handleSetFocusedOptionIndex,
      isOptionDisabled,
      selectionOptionsRef,
      virtualizer,
    ]
  )

  React.useEffect(() => {
    const currentPopoverContent = popoverContentRef.current
    currentPopoverContent?.addEventListener("keydown", handleKeyDown)

    return () => {
      currentPopoverContent?.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown, popoverContentRef])

  // Search

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const debouncedHandleSearch = React.useCallback(
    (newSearch: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setSearch(newSearch)
        handleSetFocusedOptionIndex(initialFocusedOptionIndex)
        virtualizer.scrollToIndex(0)
      }, searchDebounceMilliseconds)
    },
    [
      handleSetFocusedOptionIndex,
      initialFocusedOptionIndex,
      searchDebounceMilliseconds,
      virtualizer,
    ]
  )

  return (
    <>
      {enableSearch && (
        <SelectSearch
          onSearch={debouncedHandleSearch}
          placeholder={searchPlaceholder}
          disabled={options.length === 0}
        />
      )}
      <div
        tabIndex={-1}
        ref={scrollElementRef}
        className="overflow-x-hidden overflow-y-auto outline-hidden"
        style={{
          minHeight,
          maxHeight,
        }}
      >
        {effectiveOptions.length === 0 ? (
          <div className="truncate px-2 py-6 text-center text-sm">
            {noOptionsMessage}
          </div>
        ) : (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualOption) => {
              const { key, index, start, size } = virtualOption

              if (isOptionGroup(index)) {
                const group = effectiveOptions[index] as string
                const isSticky =
                  stickyGroups && activeOptionGroupIndexRef.current === index

                return (
                  <SelectOptionGroup
                    key={key}
                    group={group}
                    isSticky={isSticky}
                    size={size}
                    start={start}
                  />
                )
              }

              const option = effectiveOptions[index] as Option
              const optionValue = getOptionValue(option)
              const optionLabel = getOptionLabel(option)
              const isSelected = isOptionSelected(optionValue)
              const isFocused = index === focusedOptionIndex
              const isDisabled = isOptionDisabled(option)

              return (
                <SelectOption
                  key={key}
                  index={index}
                  optionValue={optionValue}
                  optionLabel={optionLabel}
                  isFocused={isFocused}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  size={size}
                  start={start}
                  handleSetFocusedOptionIndex={handleSetFocusedOptionIndex}
                  handleSelectOption={handleSelectOption}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
