import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";

export interface Locale {
  value: string;
  label: string;
  flag: string;
  description: string;
}

const locales: Locale[] = [
  {
    value: "international",
    label: "International",
    flag: "🌍",
    description: "Global search (no specific region)",
  },
  {
    value: "europe",
    label: "Europe",
    flag: "🇪🇺",
    description: "European market focus",
  },
  {
    value: "germany",
    label: "Germany",
    flag: "🇩🇪",
    description: "German market focus",
  },
  {
    value: "usa",
    label: "USA",
    flag: "🇺🇸",
    description: "United States market focus",
  },
];

interface LocaleSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function LocaleSelector({ value, onValueChange }: LocaleSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedLocale =
    locales.find((locale) => locale.value === value) || locales[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedLocale.flag}</span>
            <span className="font-medium">{selectedLocale.label}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search locale..." />
          <CommandList>
            <CommandEmpty>No locale found.</CommandEmpty>
            <CommandGroup>
              {locales.map((locale) => (
                <CommandItem
                  key={locale.value}
                  value={locale.value}
                  onSelect={(currentValue: string) => {
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === locale.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{locale.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{locale.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {locale.description}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
