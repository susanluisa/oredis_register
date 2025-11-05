"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
  value: string | number
  label: string
}

interface MultiSelectProps {
  options?: Option[]
  values?: Array<string | number>
  onChange?: (values: Array<string | number>) => void
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  displaySelectedAs?: "count" | "labels"
}

export function MultiSelect({
  options = [],
  values = [],
  onChange,
  placeholder = "Seleccionar...",
  loading = false,
  disabled = false,
  displaySelectedAs = "count",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedLabels = options.filter(o => values.includes(o.value)).map(o => o.label)
  const buttonText = loading
    ? "Cargando..."
    : values.length === 0
      ? placeholder
      : displaySelectedAs === "labels"
        ? selectedLabels.join(", ")
        : `${values.length} seleccionados`

  const toggle = (val: string | number) => {
    if (values.includes(val)) {
      onChange?.(values.filter(v => v !== val))
    } else {
      onChange?.([...values, val])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className="w-[320px] justify-between"
        >
          {buttonText}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandList>
            {loading ? (
              <CommandEmpty>Cargando datos...</CommandEmpty>
            ) : options.length === 0 ? (
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={String(option.value)}
                    onSelect={() => toggle(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        values.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

