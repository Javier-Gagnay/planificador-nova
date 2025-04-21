
import React, { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useProjectStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Calendar, ZoomIn, ZoomOut } from "lucide-react";

const GanttChart = ({ projectId }) => {
  const { tasks, updateTask } = useProjectStore();
  const [viewMode, setViewMode] = useState(ViewMode.Day);
  
  const projectTasks = tasks
    .filter((task) => task.projectId === projectId)
    .map((task) => ({
      id: task.id.toString(),
      name: task.title,
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      progress: task.progress || 0,
      type: "task",
      project: projectId.toString(),
      styles: {
        progressColor: task.priority === 'high' ? '#ef4444' : 
                      task.priority === 'medium' ? '#eab308' : '#22c55e',
        progressSelectedColor: '#60a5fa',
      },
    }));

  const handleTaskChange = (task) => {
    updateTask(parseInt(task.id), {
      startDate: task.start.toISOString(),
      endDate: task.end.toISOString(),
      progress: task.progress,
    });
  };

  const handleProgressChange = (task) => {
    updateTask(parseInt(task.id), {
      progress: task.progress,
    });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="mt-6 p-4 bg-card rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          📊 Diagrama de Gantt
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewModeChange(ViewMode.Day)}
          >
            Día
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewModeChange(ViewMode.Week)}
          >
            Semana
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewModeChange(ViewMode.Month)}
          >
            Mes
          </Button>
        </div>
      </div>
      
      <div className="h-[400px] bg-background rounded-lg p-4">
        {projectTasks.length > 0 ? (
          <Gantt
            tasks={projectTasks}
            viewMode={viewMode}
            onDateChange={handleTaskChange}
            onProgressChange={handleProgressChange}
            listCellWidth="155px"
            columnWidth={65}
            barFill={75}
            handleWidth={10}
            todayColor="var(--primary)"
            projectProgressColor="var(--primary)"
            progressColor="var(--primary)"
            barProgressColor="var(--primary)"
            rtl={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No hay tareas para mostrar en el diagrama
          </div>
        )}
      </div>
    </div>
  );
};

export default GanttChart;
