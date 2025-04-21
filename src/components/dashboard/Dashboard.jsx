import React from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store";
import TaskBoard from "@/components/tasks/TaskBoard";
import GanttChart from "@/components/gantt/GanttChart";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableProjectCard = ({ project, editingProject, editTitle, setEditTitle, handleEditProject, handleSaveEdit, getProjectTaskCount, onSelectProject }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: 1.02 }}
      className={`bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-lg cursor-pointer ${isDragging ? 'opacity-50' : ''
        }`}
      onClick={() => onSelectProject(project.id)}
    >
      <div className="flex justify-between items-start">
        {editingProject === project.id ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => handleSaveEdit(project.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit(project.id);
              }
            }}
            className="bg-transparent border-none text-xl font-semibold focus:outline-none focus:ring-0"
            autoFocus
          />
        ) : (
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditProject(project.id, project.title);
            }}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-300">
          Creado: {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <span className="text-sm text-gray-300">
          {getProjectTaskCount(project.id)} tareas
        </span>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { projects, addProject, updateProject, tasks } = useProjectStore();
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [editingProject, setEditingProject] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now(),
      title: "Nuevo Proyecto",
      createdAt: new Date().toISOString(),
    };
    addProject(newProject);
    setSelectedProject(newProject.id);
  };

  const handleEditProject = (projectId, currentTitle) => {
    setEditingProject(projectId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = (projectId) => {
    if (editTitle.trim()) {
      updateProject(projectId, { title: editTitle });
      setEditingProject(null);
    }
  };

  const getProjectTaskCount = (projectId) => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const newProjects = [...projects];
      const [removed] = newProjects.splice(oldIndex, 1);
      newProjects.splice(newIndex, 0, removed);
      useProjectStore.setState({ projects: newProjects });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Proyectos</h2>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </div>

      {!selectedProject ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  editingProject={editingProject}
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  handleEditProject={handleEditProject}
                  handleSaveEdit={handleSaveEdit}
                  getProjectTaskCount={getProjectTaskCount}
                  onSelectProject={setSelectedProject}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div>
          <Button
            variant="outline"
            onClick={() => setSelectedProject(null)}
            className="mb-4"
          >
            ← Volver a Proyectos
          </Button>

          <div className="space-y-6">
            <TaskBoard projectId={selectedProject} />
            <GanttChart projectId={selectedProject} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
