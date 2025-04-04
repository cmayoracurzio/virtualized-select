type BaseSelectProps<Option> = {
  /** Array of options to display in the select */
  options: Option[]

  /** Function to get the unique value/id for an option */
  getOptionValue: (option: Option) => string

  /** Optional function to get the display label for an option. Defaults to getOptionValue if not provided */
  getOptionLabel?: (option: Option) => string

  /** Optional function to group options. Returns the group name for an option */
  getOptionGroup?: (option: Option) => string

  /** Optional function to determine if an option should be disabled */
  isOptionDisabled?: (option: Option) => boolean

  /** Message to display when there are no options */
  noOptionsMessage?: string

  /** Whether the entire select component is disabled */
  isDisabled?: boolean

  /** Whether to close the dropdown when selection changes */
  closeOnChange?: boolean

  /** Whether to force at least one selected option */
  forceSelection?: boolean

  /** Whether to focus the first option when opening the dropdown */
  initialFocusOnFirstOption?: boolean

  /** Whether to make option groups sticky while scrolling */
  stickyGroups?: boolean

  /** Whether to enable search functionality */
  enableSearch?: boolean

  /** Placeholder text for the search input */
  searchPlaceholder?: string

  /** Debounce time in milliseconds for search input */
  searchDebounceMilliseconds?: number

  /** Whether to show selection options (Select All/Clear for multi-select) */
  enableSelectionOptions?: boolean

  /** Optional function to get the height of an option in pixels */
  getOptionSize?: (option: Option) => number

  /** Default height in pixels for options when getOptionSize is not provided */
  defaultOptionSize?: number

  /** Optional function to get the height of an option group in pixels */
  getOptionGroupSize?: (group: string) => number

  /** Default height in pixels for option groups when getOptionGroupSize is not provided */
  defaultOptionGroupSize?: number

  /** Gap size in pixels between options */
  gap?: number

  /** Number of items to render outside of the visible area */
  overscan?: number

  /** Whether to enable looping through options with keyboard navigation */
  loop?: boolean
}

export type SelectProps<Option> = BaseSelectProps<Option> &
  (
    | {
        // Single selection props
        isMulti: false
        selection?: string | null
        defaultSelection?: string | null
        onSelectionChange?: (selection: string | null) => void
      }
    | {
        // Multiple selection props
        isMulti: true
        selection?: string[]
        defaultSelection?: string[]
        onSelectionChange?: (selection: string[]) => void
      }
  )
