
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { weekdayOptions, Weekday } from '@/types/task';
import TaskCard from './TaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const TaskList = () => {
  const { tasks, getTasksByWeekday } = useTaskContext();
  const isMobile = useIsMobile();
  
  // Get the current day of the week as default tab
  const getCurrentDayIndex = () => {
    const dayIndex = new Date().getDay();
    // Convert to our weekday index (0 = Monday, 6 = Sunday)
    return dayIndex === 0 ? 6 : dayIndex - 1;
  };

  const defaultTab = weekdayOptions[getCurrentDayIndex()].value;

  if (tasks.length === 0) {
    return (
      <div className="py-10 text-center">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Nenhuma tarefa ainda</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adicione sua primeira tarefa para começar a organizar as rotações.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="mb-4 overflow-x-auto pb-1">
        <TabsList className="h-auto inline-flex min-w-full">
          {weekdayOptions.map((day) => (
            <TabsTrigger 
              key={day.value} 
              value={day.value}
              className={`flex-1 px-2.5 py-1.5 ${isMobile ? 'text-xs' : ''}`}
            >
              {isMobile ? day.label.substring(0, 3) : day.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {weekdayOptions.map((day) => {
        const weekdayTasks = getTasksByWeekday(day.value);
        
        return (
          <TabsContent key={day.value} value={day.value} className="mt-0">
            <h3 className="text-lg font-medium mb-4">
              De quem é a responsabilidade {day.label.toLowerCase()}?
            </h3>
            
            {weekdayTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma tarefa para {day.label}.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {weekdayTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    highlightWeekday={day.value} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default TaskList;
