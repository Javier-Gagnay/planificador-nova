import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, GripVertical, LayoutDashboard, Calendar, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore, useThemeStore } from "@/lib/store";
import TaskBoard from "@/components/tasks/TaskBoard";
import GanttChart from "@/components/gantt/GanttChart";
import TaskDonutChart from "./TaskDonutChart";
import TaskAssigneeBarChart from "./TaskAssigneeBarChart";
import UpcomingTasksPanel from "./UpcomingTasksPanel";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuthStore } from "@/lib/store";
import { useNavigate, useLocation } from "react-router-dom";

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

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { theme } = useThemeStore();

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <Calendar className="h-5 w-5" />, label: "Calendario", path: "/calendar" },
    { icon: <Settings className="h-5 w-5" />, label: "Configuración", path: "/settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:relative z-50 h-screen w-64 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        border-r
      `}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Planner Pro
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={`w-full justify-start ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4">
          <Button
            variant="ghost"
            className={`w-full justify-start text-red-500 hover:text-red-600 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const { projects, addProject, updateProject, tasks } = useProjectStore();
  const { theme } = useThemeStore();
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Dummy data for charts
  const taskStatusData = [
    { status: 'Completadas', value: 12, color: '#10B981' },
    { status: 'En Progreso', value: 8, color: '#F59E0B' },
    { status: 'Pendientes', value: 5, color: '#EF4444' }
  ];

  const taskAssigneeData = [
    { assignee: 'Ana', count: 7, color: '#60A5FA' },
    { assignee: 'Juan', count: 5, color: '#34D399' },
    { assignee: 'María', count: 8, color: '#F472B6' },
    { assignee: 'Carlos', count: 4, color: '#A78BFA' }
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Diseño de interfaz',
      dueDate: '2024-03-20',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Desarrollo backend',
      dueDate: '2024-03-22',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Testing',
      dueDate: '2024-03-25',
      status: 'completed',
      priority: 'low'
    }
  ];

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
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1">
        {/* Mobile header */}
        <div className="md:hidden p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h2>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6"
        >
          {!selectedProject ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Dashboard
                </h2>
                <Button onClick={handleCreateProject}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
                </Button>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <TaskDonutChart
                  data={taskStatusData}
                  width={400}
                  height={300}
                />
                <TaskAssigneeBarChart
                  data={taskAssigneeData}
                  width={400}
                  height={300}
                />
              </div>

              {/* Upcoming Tasks */}
              <div className="mb-6">
                <UpcomingTasksPanel tasks={upcomingTasks} />
              </div>

              {/* Projects Section */}
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Mis Proyectos
              </h2>
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
            </>
          ) : (
            <div>
              <Button
                variant="outline"
                onClick={() => setSelectedProject(null)}
                className="mb-4"
              >
                ← Volver a Dashboard
              </Button>

              <div className="space-y-6">
                <TaskBoard projectId={selectedProject} />
                <GanttChart projectId={selectedProject} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
