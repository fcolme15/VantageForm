import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import {Sport, MLModel, ProjectionType} from "@/components/dashboard/Interfaces"

// Component interface
interface DropdownProps {
  options: (Sport | MLModel | ProjectionType)[];
  selected: Sport | MLModel | ProjectionType | null;
  onSelect: (option: Sport | MLModel | ProjectionType) => void;
  placeholder: string;
  className?: string;
}

// Main Dropdown Component
const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  selected, 
  onSelect, 
  placeholder, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0B1901]/50 border border-green-800 rounded-lg px-4 py-3 text-left text-white flex items-center justify-between hover:bg-[#0B1901]/70 transition-all"
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              {'icon' in selected && selected.icon && <span>{selected.icon}</span>}
              {selected.name}
              {'accuracy' in selected && selected.accuracy && (
                <span className="text-green-400 text-sm">({selected.accuracy})</span>
              )}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#0B1901] border border-green-800 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.name}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-green-800/50 flex items-center gap-2 border-b border-green-800 last:border-b-0"
            >
              {'icon' in option && option.icon && <span>{option.icon}</span>}
              {option.name}
              {'accuracy' in option && option.accuracy && (
                <span className="ml-auto text-green-400 text-sm">({option.accuracy})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;