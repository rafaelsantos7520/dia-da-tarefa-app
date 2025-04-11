
import React from 'react';
import { Weekday, weekdayOptions } from '@/types/task';
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";

interface WeekdaySelectorProps {
  selectedWeekdays: Weekday[];
  onChange: (weekdays: Weekday[]) => void;
  className?: string;
}

const WeekdaySelector = ({ 
  selectedWeekdays, 
  onChange,
  className 
}: WeekdaySelectorProps) => {
  const toggleWeekday = (weekday: Weekday) => {
    if (selectedWeekdays.includes(weekday)) {
      onChange(selectedWeekdays.filter(day => day !== weekday));
    } else {
      onChange([...selectedWeekdays, weekday]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {weekdayOptions.map((weekday) => {
        const isSelected = selectedWeekdays.includes(weekday.value);
        
        return (
          <button
            key={weekday.value}
            type="button"
            onClick={() => toggleWeekday(weekday.value)}
            className={cn(
              "h-8 w-8 rounded-full text-sm font-medium transition-colors",
              isSelected 
                ? `bg-${weekday.color} text-white border-2 border-${weekday.color} shadow-sm` 
                : `bg-${weekday.color}/20 text-${weekday.color} border border-${weekday.color}/30 hover:bg-${weekday.color}/30`
            )}
            title={weekday.label}
          >
            {weekday.label.substring(0, 1)}
          </button>
        );
      })}
    </div>
  );
};

export default WeekdaySelector;
