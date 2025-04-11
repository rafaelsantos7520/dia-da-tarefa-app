
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task, Weekday } from '@/types/task';
import WeekdaySelector from './WeekdaySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarDays, PlusCircle, X, Users, Plus, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [currentAssignee, setCurrentAssignee] = useState('');
  const [assignees, setAssignees] = useState<string[]>(editTask?.assignees || []);
  const [selectedWeekdays, setSelectedWeekdays] = useState<Weekday[]>(
    editTask?.weekdays || []
  );

  const handleAddAssignee = () => {
    if (!currentAssignee.trim()) {
      toast.error('Digite o nome do responsável');
      return;
    }
    
    // Verificar se já existe esse responsável
    if (assignees.includes(currentAssignee.trim())) {
      toast.error('Este responsável já foi adicionado');
      return;
    }
    
    setAssignees(prev => [...prev, currentAssignee.trim()]);
    setCurrentAssignee('');
  };

  const handleRemoveAssignee = (index: number) => {
    setAssignees(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Por favor, adicione um título para a tarefa');
      return;
    }
    
    if (assignees.length === 0) {
      toast.error('Por favor, adicione pelo menos um responsável pela tarefa');
      return;
    }
    
    if (selectedWeekdays.length === 0) {
      toast.error('Por favor, selecione pelo menos um dia da semana');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      assignees: assignees,
      weekdays: selectedWeekdays,
    };

    if (editTask) {
      updateTask({
        ...taskData, 
        id: editTask.id, 
        createdAt: editTask.createdAt,
        currentAssigneeIndex: editTask.currentAssigneeIndex || 0,
        status: editTask.status || {}
      });
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
      setAssignees([]);
      setCurrentAssignee('');
      setSelectedWeekdays([]);
    }
  };

  // Resto do código permanece igual
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
          placeholder="Ex: Pagar a coca"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4" />
          <label className="text-sm font-medium">Responsáveis (rotação)</label>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Input
            value={currentAssignee}
            onChange={(e) => setCurrentAssignee(e.target.value)}
            placeholder="Digite um nome e adicione"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAssignee();
              }
            }}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddAssignee}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {assignees.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {assignees.map((assignee, index) => (
              <div 
                key={index} 
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
              >
                <span>{assignee}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveAssignee(index)}
                  className="h-4 w-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Adicione pessoas para criar a rotação
          </p>
        )}
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
          <DialogDescription>
            Adicione uma nova tarefa rotativa para o seu grupo.
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
