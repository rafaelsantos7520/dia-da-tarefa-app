
import React from 'react';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16">
      <header className="py-6 sm:py-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dia de Quem?</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <TaskForm 
            triggerButton={
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                <span className="hidden xs:inline">Nova Tarefa</span>
              </Button>
            } 
          />
        </div>
      </header>
      
      <main>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Organização de tarefas rotativas</h2>
          <p className="text-muted-foreground mb-4">
            Veja quem é responsável por cada tarefa durante a semana, com rotação automática entre os participantes.
          </p>
        </div>
        
        <TaskList />
      </main>
    </div>
  );
};

export default Index;
