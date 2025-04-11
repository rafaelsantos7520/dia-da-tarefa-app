
import React from 'react';
import { Weekday, weekdayOptions } from '@/types/task';
import { cn } from '@/lib/utils';

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
              "weekday-badge",
              `text-${weekday.color}`,
              isSelected 
                ? `bg-${weekday.color} text-white ring-2 ring-${weekday.color}/30` 
                : `bg-${weekday.color}/10 border border-${weekday.color}/20`
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
