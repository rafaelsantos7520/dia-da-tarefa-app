import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Weekday } from '@/types/task';
import { toast } from 'sonner';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  getTasksByWeekday: (weekday: Weekday) => Task[];
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
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
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

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, getTasksByWeekday }}
    >
      {children}
    </TaskContext.Provider>
  );
};
