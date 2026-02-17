import { useState, useEffect, useRef } from "react";
import { useVisitors } from "@/hooks/use-visitors";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { Visitor } from "@shared/schema";

interface SuggestionInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onSelectVisitor: (visitor: Visitor) => void;
  icon?: React.ReactNode;
}

export function SuggestionInput({ label, onSelectVisitor, className, icon, value, ...props }: SuggestionInputProps) {
  const [searchTerm, setSearchTerm] = useState((value as string) || "");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Update internal search term if value prop changes
  useEffect(() => {
    setSearchTerm((value as string) || "");
  }, [value]);

  // Only search when there's input
  const { data: suggestions } = useVisitors(searchTerm.length > 1 ? searchTerm : undefined);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setIsOpen(val.length > 1);
    if (props.onChange) props.onChange(e);
  };

  const handleSelect = (visitor: Visitor) => {
    onSelectVisitor(visitor);
    setSearchTerm(visitor.name); 
    setIsOpen(false);
  };

  return (
    <div className="relative space-y-2" ref={wrapperRef}>
      <label className="text-sm font-medium text-muted-foreground ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          {...props}
          value={searchTerm}
          onChange={handleInputChange}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200",
            icon && "pl-10",
            className
          )}
          autoComplete="off"
        />
        {isOpen && suggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border">
              Önerilen Kayıtlar
            </div>
            <ul className="max-h-60 overflow-auto py-1">
              {suggestions.map((visitor) => (
                <li
                  key={visitor.id}
                  onClick={() => handleSelect(visitor)}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-border/50 last:border-0 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white group-hover:text-primary transition-colors">
                        {visitor.name} {visitor.surname}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {visitor.company} • {visitor.plate}
                      </p>
                    </div>
                    <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
