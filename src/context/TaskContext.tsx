
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Weekday, TaskStatus, formatDateKey, getCurrentWeekday, getNextAssigneeIndex } from '@/types/task';
import { toast } from 'sonner';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'currentAssigneeIndex' | 'status'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  getTasksByWeekday: (weekday: Weekday) => Task[];
  completeTask: (taskId: string) => void;
  skipTask: (taskId: string) => void;
  resetTaskStatus: (taskId: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
      // Migrar tarefas antigas para o novo formato, se necessário
      const parsedTasks = JSON.parse(savedTasks);
      return parsedTasks.map((task: any) => ({
        ...task,
        currentAssigneeIndex: task.currentAssigneeIndex ?? 0,
        status: task.status || {},
      }));
    }
    
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'currentAssigneeIndex' | 'status'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      currentAssigneeIndex: 0,
      status: {},
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success('Tarefa adicionada com sucesso!');
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => 
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success('Tarefa atualizada com sucesso!');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success('Tarefa removida com sucesso!');
  };

  const getTasksByWeekday = (weekday: Weekday) => {
    return tasks.filter((task) => task.weekdays.includes(weekday));
  };

  // Nova função para marcar uma tarefa como concluída
  const completeTask = (taskId: string) => {
    setTasks((prev) => 
      prev.map((task) => {
        if (task.id !== taskId) return task;

        // Criar cópia do status atual
        const today = formatDateKey();
        const newStatus = { ...task.status, [today]: 'completed' as TaskStatus };
        
        // Atualizar o índice do próximo responsável (rotação)
        // Só avançamos o índice se a tarefa foi concluída
        const nextIndex = getNextAssigneeIndex(task);
        
        return {
          ...task,
          status: newStatus,
          currentAssigneeIndex: nextIndex,
          lastCompletionDate: new Date().toISOString(),
        };
      })
    );
    toast.success('Tarefa marcada como concluída!');
  };

  // Nova função para marcar uma tarefa como pulada (não concluída)
  const skipTask = (taskId: string) => {
    setTasks((prev) => 
      prev.map((task) => {
        if (task.id !== taskId) return task;
        
        const today = formatDateKey();
        // Marcar como pulada, mas não avançar a rotação
        const newStatus = { ...task.status, [today]: 'skipped' as TaskStatus };
        
        return {
          ...task,
          status: newStatus,
        };
      })
    );
    toast.info('Tarefa marcada como pulada para hoje.');
  };

  // Nova função para resetar o status da tarefa de hoje
  const resetTaskStatus = (taskId: string) => {
    setTasks((prev) => 
      prev.map((task) => {
        if (task.id !== taskId) return task;
        
        const today = formatDateKey();
        const newStatus = { ...task.status };
        delete newStatus[today]; // Remove o status de hoje
        
        return {
          ...task,
          status: newStatus,
        };
      })
    );
    toast.info('Status da tarefa resetado para hoje.');
  };

  return (
    <TaskContext.Provider
      value={{ 
        tasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        getTasksByWeekday,
        completeTask,
        skipTask,
        resetTaskStatus
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
