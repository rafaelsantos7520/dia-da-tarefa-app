export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TaskStatus = 'pending' | 'completed' | 'skipped';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignees: string[]; 
  weekdays: Weekday[];
  createdAt: string;
  currentAssigneeIndex: number; // Índice atual na rotação
  lastCompletionDate?: string; // Data da última conclusão
  status: Record<string, TaskStatus>; // Status indexado por data (YYYY-MM-DD)
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

export const getCurrentWeekday = (): Weekday => {
  const days: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = new Date().getDay();
  return days[today];
};

export const formatDateKey = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDateKey(date1) === formatDateKey(date2);
};

export const getAssigneeForWeekday = (task: Task, weekday: Weekday): string => {
  if (!task.weekdays.includes(weekday) || task.assignees.length === 0) {
    return '';
  }
  
  const todayKey = formatDateKey();
  const assigneeIndex = task.currentAssigneeIndex % task.assignees.length;
  return task.assignees[assigneeIndex];
};

export const getNextAssigneeIndex = (task: Task): number => {
  if (task.assignees.length <= 1) return 0;
  return (task.currentAssigneeIndex + 1) % task.assignees.length;
};

export const getTaskStatusForToday = (task: Task): TaskStatus => {
  const today = formatDateKey();
  return task.status[today] || 'pending';
};
