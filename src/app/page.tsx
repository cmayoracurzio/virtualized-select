"use client"

import {
  ChangeEvent,
  KeyboardEvent,
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react"
import { faker } from "@faker-js/faker"

import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select as VirtualizedSelect } from "@/components/virtualized-select/select"
import { SelectSize } from "@/components/virtualized-select/types"

type Option = {
  index: number
  firstName: string
  lastName: string
}

const OPTIONS: Option[] = Array.from({ length: 200000 }, (_, index) => ({
  index,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}))

export default function Page() {
  const [isMulti, setIsMulti] = useState<boolean>(true)
  const [numOptions, setNumOptions] = useState<number>(
    Math.floor(OPTIONS.length)
  )
  const [options, setOptions] = useState<Option[]>(OPTIONS.slice(0, numOptions))

  const getOptionValue = useCallback((option: Option) => {
    return option.index.toString()
  }, [])

  const [singleSelection, setSingleSelection] = useState<string | null>(null)
  const [multipleSelection, setMultipleSelection] = useState<string[]>([])

  const handleIsMultiChange = useCallback((newIsMulti: boolean) => {
    setIsMulti(newIsMulti)
    setSingleSelection(null)
    setMultipleSelection([])
  }, [])

  const handleSelectionChange = useCallback(() => {
    if (Math.random() < 0.25) {
      // 25% chance to clear selection
      setSingleSelection(null)
      setMultipleSelection([])
    } else {
      // For single selection, pick one random option
      const randomIndex = Math.floor(Math.random() * options.length)
      setSingleSelection(getOptionValue(options[randomIndex]))

      // For multiple selection, pick random number of options (1 to options.length)
      const numSelections = Math.floor(Math.random() * options.length) + 1
      const selectedIndices = new Set<string>()
      while (
        selectedIndices.size < numSelections &&
        selectedIndices.size < options.length
      ) {
        const randomIndex = Math.floor(Math.random() * options.length)
        selectedIndices.add(getOptionValue(options[randomIndex]))
      }
      setMultipleSelection(Array.from(selectedIndices))
    }
  }, [getOptionValue, options])

  const debouncedHandleOptionsChange = useDebounce((newNumOptions: number) => {
    setOptions(OPTIONS.slice(0, newNumOptions))
    setSingleSelection(null)
    setMultipleSelection([])
  }, 200)

  const handleNumOptionsChange = useCallback(
    (newNumOptions: number) => {
      if (newNumOptions === options.length) {
        return
      }

      setNumOptions(newNumOptions)
      debouncedHandleOptionsChange(newNumOptions)
    },
    [debouncedHandleOptionsChange, options.length]
  )

  const [hasOptionLabel, setHasOptionLabel] = useState<boolean>(true)

  const getOptionLabel = useMemo(() => {
    if (!hasOptionLabel) {
      return undefined
    }

    return (option: Option) =>
      option.lastName.toUpperCase() + ", " + option.firstName
  }, [hasOptionLabel])

  const [hasOptionGroup, setHasOptionGroup] = useState<boolean>(true)

  const getOptionGroup = useMemo(() => {
    if (!hasOptionGroup) {
      return undefined
    }

    return (option: Option) => option.lastName.charAt(0).toUpperCase()
  }, [hasOptionGroup])

  const [hasIsOptionDisabled, setHasIsOptionDisabled] = useState<boolean>(false)

  const isOptionDisabled = useCallback(
    (option: Option) => {
      return hasIsOptionDisabled && option.index % 2 === 0
    },
    [hasIsOptionDisabled]
  )

  const [size, setSize] = useState<SelectSize>("default")
  const [noOptionsMessage, setNoOptionsMessage] = useState<string | undefined>(
    undefined
  )
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [closeOnChange, setCloseOnChange] = useState<boolean>(false)
  const [forceSelection, setForceSelection] = useState<boolean>(false)
  const [initialFocusOnFirstOption, setInitialFocusOnFirstOption] =
    useState<boolean>(false)
  const [stickyGroups, setStickyGroups] = useState<boolean>(true)
  const [enableSearch, setEnableSearch] = useState<boolean>(true)
  const [searchPlaceholder, setSearchPlaceholder] = useState<
    string | undefined
  >(undefined)
  const [searchDebounceMilliseconds, setSearchDebounceMilliseconds] =
    useState<number>(200)
  const [enableSelectionOptions, setEnableSelectionOptions] =
    useState<boolean>(true)
  const [defaultOptionSize, setDefaultOptionSize] = useState<number>(36)
  const [defaultOptionGroupSize, setDefaultOptionGroupSize] =
    useState<number>(28)
  const [gap, setGap] = useState<number>(0)
  const [overscan, setOverscan] = useState<number>(10)
  const [loop, setLoop] = useState<boolean>(true)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground">Component:</h3>
          {isMulti ? (
            <VirtualizedSelect
              isMulti={true}
              selection={multipleSelection}
              onSelectionChange={setMultipleSelection}
              options={options}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              getOptionGroup={getOptionGroup}
              isOptionDisabled={isOptionDisabled}
              size={size}
              noOptionsMessage={noOptionsMessage}
              isDisabled={isDisabled}
              closeOnChange={closeOnChange}
              forceSelection={forceSelection}
              initialFocusOnFirstOption={initialFocusOnFirstOption}
              stickyGroups={stickyGroups}
              enableSearch={enableSearch}
              searchPlaceholder={searchPlaceholder}
              searchDebounceMilliseconds={searchDebounceMilliseconds}
              enableSelectionOptions={enableSelectionOptions}
              defaultOptionSize={defaultOptionSize}
              defaultOptionGroupSize={defaultOptionGroupSize}
              gap={gap}
              overscan={overscan}
              loop={loop}
            />
          ) : (
            <VirtualizedSelect
              isMulti={false}
              selection={singleSelection}
              onSelectionChange={setSingleSelection}
              options={options}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              getOptionGroup={getOptionGroup}
              isOptionDisabled={isOptionDisabled}
              size={size}
              noOptionsMessage={noOptionsMessage}
              isDisabled={isDisabled}
              closeOnChange={closeOnChange}
              forceSelection={forceSelection}
              initialFocusOnFirstOption={initialFocusOnFirstOption}
              stickyGroups={stickyGroups}
              enableSearch={enableSearch}
              searchPlaceholder={searchPlaceholder}
              searchDebounceMilliseconds={searchDebounceMilliseconds}
              enableSelectionOptions={enableSelectionOptions}
              defaultOptionSize={defaultOptionSize}
              defaultOptionGroupSize={defaultOptionGroupSize}
              gap={gap}
              overscan={overscan}
              loop={loop}
            />
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm text-muted-foreground">Installation:</h3>
          <p className="text-sm font-medium leading-8">
            shadcn/ui CLI installation coming soon
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm text-muted-foreground">Props:</h3>
        <div className="space-y-4">
          <SwitchField
            label="isMulti"
            description="Whether to allow multiple selections"
            required={true}
            value={isMulti}
            onChange={handleIsMultiChange}
          />
          <SliderField
            label="options"
            description="Array of options"
            required={true}
            value={numOptions}
            minValue={0}
            maxValue={OPTIONS.length}
            onChange={handleNumOptionsChange}
          />
          <SwitchField
            label="getOptionValue"
            required={true}
            description="Callback to get the value of an option"
            value={true}
            disabled={true}
          />
          <ButtonField
            label="selection"
            description="Controlled selection"
            buttonChildren="Randomize"
            onClick={handleSelectionChange}
          />
          <SwitchField
            label="onSelectionChange"
            description="Callback to handle selection change"
            value={true}
            disabled={true}
          />
          <SwitchField
            label="defaultSelection"
            description="Default selection for uncontrolled mode"
            value={true}
            disabled={true}
          />

          <SwitchField
            label="getOptionLabel"
            description="Callback to get the label of an option"
            value={hasOptionLabel}
            onChange={setHasOptionLabel}
          />
          <SwitchField
            label="getOptionGroup"
            description="Callback to group options"
            value={hasOptionGroup}
            onChange={setHasOptionGroup}
          />
          <SwitchField
            label="isOptionDisabled"
            description="Callback to determine if an option is disabled"
            value={hasIsOptionDisabled}
            onChange={setHasIsOptionDisabled}
          />
          <SelectField
            label="size"
            description="Size of the component (when closed)"
            value={size}
            onChange={setSize}
          />
          <InputField
            label="noOptionsMessage"
            description="Message when there are no options"
            value={noOptionsMessage}
            onChange={setNoOptionsMessage}
          />
          <SwitchField
            label="isDisabled"
            description="Disable the component"
            value={isDisabled}
            onChange={setIsDisabled}
          />
          <SwitchField
            label="closeOnChange"
            description="Close dropdown on selection change"
            value={closeOnChange}
            onChange={setCloseOnChange}
          />
          <SwitchField
            label="forceSelection"
            description="Force at least one selected option"
            value={forceSelection}
            onChange={setForceSelection}
          />
          <SwitchField
            label="initialFocusOnFirstOption"
            description="Focus first option when dropdown opens"
            value={initialFocusOnFirstOption}
            onChange={setInitialFocusOnFirstOption}
          />
          <SwitchField
            label="stickyGroups"
            description="Make group headers sticky"
            value={stickyGroups}
            onChange={setStickyGroups}
          />
          <SwitchField
            label="enableSearch"
            description="Enable search in the dropdown"
            value={enableSearch}
            onChange={setEnableSearch}
          />
          <InputField
            label="searchPlaceholder"
            description="Search placeholder text"
            value={searchPlaceholder}
            onChange={setSearchPlaceholder}
          />
          <SliderField
            label="searchDebounceMilliseconds"
            description="Debounce milliseconds for search"
            value={searchDebounceMilliseconds}
            minValue={0}
            maxValue={1000}
            onChange={setSearchDebounceMilliseconds}
          />
          <SwitchField
            label="enableSelectionOptions"
            description="Enable option buttons"
            value={enableSelectionOptions}
            onChange={setEnableSelectionOptions}
          />
          <SwitchField
            label="getOptionSize"
            description="Callback to get the size of an option"
            value={true}
            disabled={true}
          />
          <SliderField
            label="defaultOptionSize"
            description="Default size of options"
            value={defaultOptionSize}
            minValue={0}
            maxValue={100}
            onChange={setDefaultOptionSize}
          />
          <SwitchField
            label="getOptionGroupSize"
            description="Callback to get the size of an option group"
            value={true}
            disabled={true}
          />
          <SliderField
            label="defaultOptionGroupSize"
            description="Default size of option groups"
            value={defaultOptionGroupSize}
            minValue={0}
            maxValue={100}
            onChange={setDefaultOptionGroupSize}
          />
          <SliderField
            label="gap"
            description="Gap between options"
            value={gap}
            minValue={0}
            maxValue={100}
            onChange={setGap}
          />
          <SliderField
            label="overscan"
            description="Options rendered beyond the visible area"
            value={overscan}
            minValue={0}
            maxValue={100}
            onChange={setOverscan}
          />
          <SwitchField
            label="loop"
            description="Loop through options when reaching the end"
            value={loop}
            onChange={setLoop}
          />
        </div>
      </div>
    </div>
  )
}

type BaseDemoFieldProps = {
  label: string
  description: string
  required?: boolean
}

type DemoFieldProps = BaseDemoFieldProps & {
  children: ReactNode
}

const DemoField = memo(
  ({ label, description, required, children }: DemoFieldProps) => {
    return (
      <div className="flex items-center justify-between gap-6 rounded-md border p-3 shadow-sm">
        <div className="flex-1 space-y-0.5">
          <p className="text-sm font-medium">
            {label}
            {required && (
              <>
                {" "}
                <span className="text-red-500">*</span>
                <span className="sr-only">Required</span>
              </>
            )}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex w-1/3 flex-col place-items-end justify-center gap-2">
          {children}
        </div>
      </div>
    )
  }
)
DemoField.displayName = "DemoField"

type InputFieldProps = BaseDemoFieldProps & {
  value: string | undefined
  onChange: (value: string | undefined) => void
}

const InputField = memo(
  ({ value, onChange, ...demoFieldProps }: InputFieldProps) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
      },
      [onChange]
    )

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (
          event.key === "Backspace" &&
          (value === "" || value === undefined)
        ) {
          event.preventDefault()
          onChange(undefined)
        }
      },
      [onChange, value]
    )

    return (
      <DemoField {...demoFieldProps}>
        <Input
          placeholder={value === undefined ? "undefined" : undefined}
          value={value ?? ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </DemoField>
    )
  }
)
InputField.displayName = "InputField"

type ButtonFieldProps = BaseDemoFieldProps & {
  buttonChildren: ReactNode
  onClick: () => void
}

const ButtonField = memo(
  ({ buttonChildren, onClick, ...demoFieldProps }: ButtonFieldProps) => {
    return (
      <DemoField {...demoFieldProps}>
        <Button variant="outline" onClick={onClick}>
          {buttonChildren}
        </Button>
      </DemoField>
    )
  }
)
ButtonField.displayName = "ButtonField"

type SwitchFieldProps = BaseDemoFieldProps & {
  value?: boolean
  onChange?: (value: boolean) => void
  disabled?: boolean
}

const SwitchField = memo(
  ({ value, onChange, disabled, ...demoFieldProps }: SwitchFieldProps) => {
    return (
      <DemoField {...demoFieldProps}>
        <Switch
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
      </DemoField>
    )
  }
)
SwitchField.displayName = "SwitchField"

type SliderFieldProps = BaseDemoFieldProps & {
  value: number
  minValue: number
  maxValue: number
  onChange: (value: number) => void
}

const SliderField = memo(
  ({
    value,
    minValue,
    maxValue,
    onChange,
    ...demoFieldProps
  }: SliderFieldProps) => {
    return (
      <DemoField {...demoFieldProps}>
        <p className="text-right text-sm">{value}</p>
        <Slider
          min={minValue}
          max={maxValue}
          value={[value]}
          step={1}
          onValueChange={(values) => onChange(values[0])}
        />
      </DemoField>
    )
  }
)
SliderField.displayName = "SliderField"

type SelectFieldProps = BaseDemoFieldProps & {
  value: SelectSize
  onChange: (value: SelectSize) => void
}

const SelectField = memo(
  ({ value, onChange, ...demoFieldProps }: SelectFieldProps) => {
    return (
      <DemoField {...demoFieldProps}>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </DemoField>
    )
  }
)
SelectField.displayName = "SelectField"
