
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignees: string[]; // Changed from single assignee to array of assignees
  weekdays: Weekday[];
  createdAt: string;
}

export const weekdayOptions: { value: Weekday; label: string; color: string }[] = [
  { value: 'monday', label: 'Segunda', color: 'task-blue' },
  { value: 'tuesday', label: 'Terça', color: 'task-green' },
  { value: 'wednesday', label: 'Quarta', color: 'task-yellow' },
  { value: 'thursday', label: 'Quinta', color: 'task-purple' },
  { value: 'friday', label: 'Sexta', color: 'task-indigo' },
  { value: 'saturday', label: 'Sábado', color: 'task-red' },
  { value: 'sunday', label: 'Domingo', color: 'task-blue' },
];

export const getWeekdayColor = (weekday: Weekday): string => {
  const option = weekdayOptions.find(opt => opt.value === weekday);
  return option ? option.color : 'task-blue';
};

export const getWeekdayLabel = (weekday: Weekday): string => {
  const option = weekdayOptions.find(opt => opt.value === weekday);
  return option ? option.label : weekday;
};

// Helper to get which person is responsible for a task on a given weekday
export const getAssigneeForWeekday = (task: Task, weekday: Weekday): string => {
  const weekdayIndex = task.weekdays.indexOf(weekday);
  if (weekdayIndex === -1) return '';
  
  // Rotate through assignees based on the weekday's position
  return task.assignees[weekdayIndex % task.assignees.length];
};
