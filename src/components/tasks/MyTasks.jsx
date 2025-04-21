import React from "react";
import { motion } from "framer-motion";
import { useProjectStore, useAuthStore } from "@/lib/store";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const TaskCard = ({ task, project }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "todo":
                return "bg-yellow-500/20 text-yellow-500";
            case "inProgress":
                return "bg-blue-500/20 text-blue-500";
            case "done":
                return "bg-green-500/20 text-green-500";
            default:
                return "bg-gray-500/20 text-gray-500";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "todo":
                return "Por hacer";
            case "inProgress":
                return "En progreso";
            case "done":
                return "Completada";
            default:
                return "Sin estado";
        }
    };

    return (
        <Link to={`/dashboard?project=${project.id}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-card p-4 rounded-lg shadow-lg space-y-2"
            >
                <div className="flex items-start justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                    </span>
                </div>
                {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {task.endDate
                                ? format(new Date(task.endDate), "dd/MM/yyyy")
                                : "Sin fecha"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{project.title}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const MyTasks = () => {
    const { getTasksByUser } = useProjectStore();
    const { user } = useAuthStore();
    const { projects } = useProjectStore();

    const tasks = getTasksByUser(user?.email || "");
    const today = new Date();
    const nextWeek = addDays(today, 7);

    const overdueTasks = tasks.filter(
        (task) => task.endDate && isBefore(new Date(task.endDate), today)
    );
    const upcomingTasks = tasks.filter(
        (task) =>
            task.endDate &&
            isAfter(new Date(task.endDate), today) &&
            isBefore(new Date(task.endDate), nextWeek)
    );
    const noDateTasks = tasks.filter((task) => !task.endDate);

    const getProjectById = (projectId) =>
        projects.find((project) => project.id === projectId);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
        >
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Mis Tareas</h1>
                    <p className="text-muted-foreground">
                        Todas las tareas asignadas a ti
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {overdueTasks.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-red-500">
                            Tareas Vencidas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {overdueTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    project={getProjectById(task.projectId)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {upcomingTasks.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-yellow-500">
                            Próximas 7 Días
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {upcomingTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    project={getProjectById(task.projectId)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {noDateTasks.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-500">
                            Sin Fecha
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {noDateTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    project={getProjectById(task.projectId)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {tasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No tienes tareas asignadas
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MyTasks; 