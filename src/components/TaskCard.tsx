
import React, { useState } from 'react';
import { Task, Weekday, getWeekdayLabel, getWeekdayColor, getAssigneeForWeekday } from '@/types/task';
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
import { Edit, Trash2, User, Users, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  highlightWeekday?: string;
}

const TaskCard = ({ task, highlightWeekday }: TaskCardProps) => {
  const { deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);

  // Get the current weekday's assignee
  const currentAssignee = highlightWeekday ? 
    getAssigneeForWeekday(task, highlightWeekday as Weekday) : '';

  return (
    <Card className="w-full h-full">
      {isEditing ? (
        <CardContent className="pt-6">
          <TaskForm 
            editTask={task} 
            onClose={() => setIsEditing(false)} 
          />
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <div className="flex gap-1">
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
              <CardDescription className="text-sm mt-2">{task.description}</CardDescription>
            )}
          </CardHeader>
          
          <CardFooter className="flex flex-wrap gap-1.5">
            {task.weekdays.map((weekday) => (
              <Badge 
                key={weekday} 
                className={`bg-${getWeekdayColor(weekday)} hover:bg-${getWeekdayColor(weekday)}/90 ${
                  highlightWeekday === weekday ? 'ring-2 ring-offset-2' : ''
                }`}
              >
                {getWeekdayLabel(weekday)}: {getAssigneeForWeekday(task, weekday)}
              </Badge>
            ))}
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TaskCard;
