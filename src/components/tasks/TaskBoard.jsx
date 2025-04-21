import React, { useState } from "react";
import { motion } from "framer-motion";
import { DndContext, closestCorners, DragOverlay, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { Plus, Calendar, Users, Tag, Clock, AlertCircle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store";
import { format } from "date-fns";
import Subtasks from "./Subtasks";
import { CSS } from "@dnd-kit/utilities";

const TaskForm = ({ onSubmit, onCancel, editTask = null }) => {
  const [task, setTask] = useState({
    title: editTask?.title || "",
    description: editTask?.description || "",
    startDate: editTask?.startDate || format(new Date(), "yyyy-MM-dd"),
    endDate: editTask?.endDate || format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    priority: editTask?.priority || "medium",
    labels: editTask?.labels || [],
    status: editTask?.status || "todo",
    assignedTo: editTask?.assignedTo || "",
    orderNumber: editTask?.orderNumber || "",
    platePhoto: editTask?.platePhoto || "",
    partPhoto: editTask?.partPhoto || "",
    machineNumber: editTask?.machineNumber || "",
    machineStopped: editTask?.machineStopped || false,
    requiredMaterials: editTask?.requiredMaterials || "",
    checklist: editTask?.checklist || [],
    attachments: editTask?.attachments || [],
    comments: editTask?.comments || "",
  });

  const { labels } = useProjectStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTask) {
      onSubmit({ ...editTask, ...task });
    } else {
      onSubmit({
        ...task,
        id: Date.now().toString(),
      });
    }
  };

  const statusOptions = [
    { id: "todo", name: "Por hacer", emoji: "📋" },
    { id: "inProgress", name: "En progreso", emoji: "⚡" },
    { id: "review", name: "En revisión", emoji: "👀" },
    { id: "testing", name: "En pruebas", emoji: "🧪" },
    { id: "done", name: "Completado", emoji: "✅" }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-card/50 to-card p-6 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border">
        <h2 className="text-xl font-semibold mb-4">{editTask ? "Editar Tarea" : "Nueva Tarea"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">📝 Título</label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">📊 Estado</label>
            <select
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            >
              {statusOptions.map(status => (
                <option key={status.id} value={status.id}>
                  {status.emoji} {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">🔢 N° de orden</label>
            <input
              type="text"
              value={task.orderNumber}
              onChange={(e) => setTask({ ...task, orderNumber: e.target.value })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">📋 Descripción</label>
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">📅 Fecha inicio</label>
            <input
              type="date"
              value={task.startDate}
              onChange={(e) => setTask({ ...task, startDate: e.target.value })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">🎯 Fecha fin</label>
            <input
              type="date"
              value={task.endDate}
              onChange={(e) => setTask({ ...task, endDate: e.target.value })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">🔧 N° de máquina</label>
            <input
              type="text"
              value={task.machineNumber}
              onChange={(e) => setTask({ ...task, machineNumber: e.target.value })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">⚠️ Estado de máquina</label>
            <select
              value={task.machineStopped ? "stopped" : "running"}
              onChange={(e) => setTask({ ...task, machineStopped: e.target.value === "stopped" })}
              className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            >
              <option value="running">En funcionamiento</option>
              <option value="stopped">Parada</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">📦 Materiales requeridos</label>
          <textarea
            value={task.requiredMaterials}
            onChange={(e) => setTask({ ...task, requiredMaterials: e.target.value })}
            className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            rows="2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">🎯 Prioridad</label>
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
          >
            <option value="low">🟢 Baja</option>
            <option value="medium">🟡 Media</option>
            <option value="high">🔴 Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">🏷️ Etiquetas</label>
          <div className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => {
                  const newLabels = task.labels.includes(label.id)
                    ? task.labels.filter((id) => id !== label.id)
                    : [...task.labels, label.id];
                  setTask({ ...task, labels: newLabels });
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${task.labels.includes(label.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
              >
                {label.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">💭 Comentarios</label>
          <textarea
            value={task.comments}
            onChange={(e) => setTask({ ...task, comments: e.target.value })}
            className="w-full p-2 rounded-lg bg-background/50 border hover:bg-background/80 focus:bg-background transition-colors"
            rows="2"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-gradient-to-r from-primary to-primary-foreground text-white">
            {editTask ? "Actualizar" : "Crear"} Tarea
          </Button>
        </div>
      </form>
    </div>
  );
};

const TaskCard = ({ task }) => {
  const { updateTask, labels } = useProjectStore();
  const [isEditing, setIsEditing] = useState(false);

  const getStatusEmoji = (status) => {
    switch (status) {
      case "todo": return "📋";
      case "inProgress": return "⚡";
      case "review": return "👀";
      case "testing": return "🧪";
      case "done": return "✅";
      default: return "📋";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "bg-yellow-500/20 text-yellow-500";
      case "inProgress": return "bg-blue-500/20 text-blue-500";
      case "review": return "bg-purple-500/20 text-purple-500";
      case "testing": return "bg-orange-500/20 text-orange-500";
      case "done": return "bg-green-500/20 text-green-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-background to-background/80 p-4 rounded-xl mb-3 shadow-sm border hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span>{getStatusEmoji(task.status)}</span>
              <h4 className="font-medium">{task.title}</h4>
            </div>
            {task.orderNumber && (
              <p className="text-sm text-muted-foreground">N° Orden: {task.orderNumber}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent/50"
            >
              ✏️
            </button>
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
              {task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟡" : "🟢"}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
        )}

        {task.machineNumber && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Máquina:</span> #{task.machineNumber}
            {task.machineStopped && (
              <span className="ml-2 text-red-500">⚠️ Parada</span>
            )}
          </div>
        )}

        {task.requiredMaterials && (
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">Materiales:</span> {task.requiredMaterials}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels?.map((labelId) => {
            const label = labels.find((l) => l.id === labelId);
            return label ? (
              <span
                key={label.id}
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                {label.name}
              </span>
            ) : null;
          })}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(task.startDate), "dd/MM/yyyy")} -
              {format(new Date(task.endDate), "dd/MM/yyyy")}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => updateTask({ ...task, status: "todo" })}
              className={`px-2 py-1 rounded-md text-xs transition-colors ${task.status === "todo"
                ? "bg-yellow-500/20 text-yellow-500"
                : "hover:bg-yellow-500/10 text-muted-foreground"
                }`}
            >
              Por hacer
            </button>
            <button
              onClick={() => updateTask({ ...task, status: "inProgress" })}
              className={`px-2 py-1 rounded-md text-xs transition-colors ${task.status === "inProgress"
                ? "bg-blue-500/20 text-blue-500"
                : "hover:bg-blue-500/10 text-muted-foreground"
                }`}
            >
              En progreso
            </button>
            <button
              onClick={() => updateTask({ ...task, status: "done" })}
              className={`px-2 py-1 rounded-md text-xs transition-colors ${task.status === "done"
                ? "bg-green-500/20 text-green-500"
                : "hover:bg-green-500/10 text-muted-foreground"
                }`}
            >
              Completado
            </button>
          </div>
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <Subtasks taskId={task.id} subtasks={task.subtasks} />
        )}
      </motion.div>

      {isEditing && (
        <TaskForm
          editTask={task}
          onSubmit={(updatedTask) => {
            updateTask(updatedTask);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

const SortableTaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
};

const TaskBoard = ({ projectId }) => {
  const { tasks, updateTask } = useProjectStore();
  const [activeTask, setActiveTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { id: "todo", name: "Por hacer", emoji: "📋", color: "from-yellow-500/20" },
    { id: "inProgress", name: "En progreso", emoji: "⚡", color: "from-blue-500/20" },
    { id: "review", name: "En revisión", emoji: "👀", color: "from-purple-500/20" },
    { id: "testing", name: "En pruebas", emoji: "🧪", color: "from-orange-500/20" },
    { id: "done", name: "Completado", emoji: "✅", color: "from-green-500/20" }
  ];

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Si se suelta sobre una columna
    const targetColumn = columns.find(col => over.id.toString() === col.id);
    if (targetColumn) {
      updateTask({ ...activeTask, status: targetColumn.id });
    } else {
      // Si se suelta sobre otra tarea
      const overTask = tasks.find(t => t.id === over.id);
      if (overTask && activeTask.id !== overTask.id) {
        updateTask({ ...activeTask, status: overTask.status });
      }
    }

    setActiveTask(null);
  };

  const projectTasks = tasks.filter(task => task.projectId === projectId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            id={column.id}
            className="w-80 flex-shrink-0"
          >
            <div className={`bg-gradient-to-br ${column.color} to-muted p-3 rounded-lg border border-border/50`}>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <span>{column.emoji}</span>
                {column.name}
              </h3>
              <SortableContext
                items={projectTasks
                  .filter(task => task.status === column.id)
                  .map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[100px]">
                  {projectTasks
                    .filter(task => task.status === column.id)
                    .map((task) => (
                      <SortableTaskCard key={task.id} task={task} />
                    ))}
                </div>
              </SortableContext>
              <Button
                variant="ghost"
                className="w-full mt-3"
                onClick={() => setIsFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir Tarea
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>

      {isFormOpen && (
        <TaskForm
          onSubmit={(task) => {
            const newTask = {
              ...task,
              id: Date.now().toString(),
              projectId,
              status: task.status || 'todo'
            };
            updateTask(newTask);
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </DndContext>
  );
};

export default TaskBoard;
