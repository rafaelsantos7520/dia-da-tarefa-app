import React, { useState } from 'react';
import { 
  Task, 
  Weekday, 
  getWeekdayLabel, 
  getWeekdayColor, 
  getAssigneeForWeekday, 
  formatDateKey,
  getTaskStatusForToday,
  getCurrentWeekday
} from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TaskForm from './TaskForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Edit, 
  Trash2, 
  User, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  UserX 
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaskCardProps {
  task: Task;
  highlightWeekday?: string;
}

const TaskCard = ({ task, highlightWeekday }: TaskCardProps) => {
  const { deleteTask, completeTask, skipTask, resetTaskStatus, markParticipantAbsent } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);

  // Determina o status da tarefa para hoje
  const today = formatDateKey();
  const taskStatus = task.status[today] || 'pending';
  
  // Determina o responsável atual
  const currentAssignee = highlightWeekday ? 
    getAssigneeForWeekday(task, highlightWeekday as Weekday) : '';

  const renderStatusActions = () => {
    if (!highlightWeekday) return null;

    switch (taskStatus) {
      case 'completed':
        return (
          <div className="flex items-center mt-2 p-2 bg-green-500/10 rounded-md">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm">Concluída hoje</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => resetTaskStatus(task.id)}
              className="ml-auto h-8 w-8"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resetar status</p>
                </TooltipContent>
              </Tooltip>
            </Button>
          </div>
        );
      
      case 'skipped':
        return (
          <div className="flex items-center mt-2 p-2 bg-amber-500/10 rounded-md">
            <XCircle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-sm">Tarefa pulada hoje</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => resetTaskStatus(task.id)}
              className="ml-auto h-8 w-8"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Resetar status</p>
                </TooltipContent>
              </Tooltip>
            </Button>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 text-xs border-green-500/20 text-green-500 hover:bg-green-500/10 hover:text-green-600"
                onClick={() => completeTask(task.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" /> Concluída
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 text-xs border-amber-500/20 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
                onClick={() => skipTask(task.id)}
              >
                <XCircle className="h-4 w-4 mr-1" /> Pulada
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600"
              onClick={() => markParticipantAbsent(task.id)}
            >
              <UserX className="h-4 w-4 mr-1" /> Participante Ausente
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      {isEditing ? (
        <CardContent className="pt-6 flex-grow">
          <TaskForm 
            editTask={task} 
            onClose={() => setIsEditing(false)} 
          />
        </CardContent>
      ) : (
        <>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg break-words">{task.title}</CardTitle>
              <div className="flex gap-1 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a tarefa '{task.title}'.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteTask(task.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            {highlightWeekday && currentAssignee && (
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-primary" />
                <CardDescription className="text-sm font-medium text-primary">
                  Responsável hoje: {currentAssignee}
                </CardDescription>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardDescription className="text-sm">
                Rotação: {task.assignees.join(' → ')}
              </CardDescription>
            </div>
            
            {task.description && (
              <CardDescription className="text-sm mt-2 line-clamp-2">{task.description}</CardDescription>
            )}
            
            {highlightWeekday === getCurrentWeekday() && renderStatusActions()}
          </CardHeader>
          
          <CardFooter className="flex flex-wrap gap-1.5 mt-auto pt-3">
            {task.weekdays.map((weekday) => {
              const colorClass = getWeekdayColor(weekday);
              const isHighlighted = highlightWeekday === weekday;
              const assignee = getAssigneeForWeekday(task, weekday);
              
              return (
                <Badge 
                  key={weekday} 
                  className={`bg-${colorClass} hover:bg-${colorClass}/90 whitespace-nowrap ${
                    isHighlighted ? 'ring-2 ring-offset-2' : ''
                  }`}
                >
                  {getWeekdayLabel(weekday)}: {assignee}
                </Badge>
              );
            })}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TaskCard;
