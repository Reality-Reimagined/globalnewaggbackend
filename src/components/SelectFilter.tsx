import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface SelectFilterProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (values: string[]) => void;
}

export function SelectFilter({ label, options, value, onChange }: SelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-between w-40 px-3 py-2 text-sm",
          "bg-white border rounded-lg shadow-sm",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
          value.length > 0 && "border-blue-500 text-blue-600",
          "transition-colors duration-200"
        )}
      >
        <span className="truncate">
          {value.length === 0
            ? label
            : value.length === 1
            ? value[0]
            : `${value.length} ${label}`}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "ml-2 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-56 mt-2 bg-white border rounded-lg shadow-lg">
          <div className="p-2 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm rounded-md",
                  "hover:bg-gray-100 focus:outline-none focus:bg-gray-100",
                  value.includes(option) && "text-blue-600 bg-blue-50 hover:bg-blue-100"
                )}
              >
                <span className="flex-1 text-left">{option}</span>
                {value.includes(option) && (
                  <Check size={16} className="ml-2 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}