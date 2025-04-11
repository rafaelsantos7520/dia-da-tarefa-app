
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task, Weekday } from '@/types/task';
import WeekdaySelector from './WeekdaySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarDays, PlusCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TaskFormProps {
  editTask?: Task;
  onClose?: () => void;
  triggerButton?: React.ReactNode;
}

const TaskForm = ({ editTask, onClose, triggerButton }: TaskFormProps) => {
  const { addTask, updateTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [assignee, setAssignee] = useState(editTask?.assignee || '');
  const [selectedWeekdays, setSelectedWeekdays] = useState<Weekday[]>(
    editTask?.weekdays || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Por favor, adicione um título para a tarefa');
      return;
    }
    
    if (!assignee.trim()) {
      toast.error('Por favor, adicione um responsável pela tarefa');
      return;
    }
    
    if (selectedWeekdays.length === 0) {
      toast.error('Por favor, selecione pelo menos um dia da semana');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      assignee: assignee.trim(),
      weekdays: selectedWeekdays,
    };

    if (editTask) {
      updateTask({ ...taskData, id: editTask.id, createdAt: editTask.createdAt });
    } else {
      addTask(taskData);
    }
    
    resetForm();
    setOpen(false);
    if (onClose) onClose();
  };

  const resetForm = () => {
    if (!editTask) {
      setTitle('');
      setDescription('');
      setAssignee('');
      setSelectedWeekdays([]);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Título da Tarefa
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Tirar o lixo"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="assignee" className="text-sm font-medium">
          Responsável
        </label>
        <Input
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Quem vai realizar esta tarefa?"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição (opcional)
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes sobre a tarefa..."
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <label className="text-sm font-medium">Dias da Semana</label>
        </div>
        <WeekdaySelector
          selectedWeekdays={selectedWeekdays}
          onChange={setSelectedWeekdays}
          className="justify-center sm:justify-start"
        />
      </div>

      <DialogFooter>
        <Button type="submit" className="w-full mt-2">
          {editTask ? 'Atualizar tarefa' : 'Adicionar tarefa'}
        </Button>
      </DialogFooter>
    </form>
  );

  if (editTask) {
    return formContent;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Nova Tarefa
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
