import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useThemeStore } from "@/lib/store";

const UpcomingTasksPanel = ({ tasks }) => {
    const { theme } = useThemeStore();

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'in-progress':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className={`rounded-lg shadow p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Tareas Próximas
            </h3>
            <div className="space-y-4">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center space-x-3">
                            {getStatusIcon(task.status)}
                            <div>
                                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {task.title}
                                </h4>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Vence: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingTasksPanel; 