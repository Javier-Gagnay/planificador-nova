import { ClockIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface Task {
    id: string
    title: string
    dueDate: string
    status: 'pending' | 'in-progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
}

interface UpcomingTasksPanelProps {
    tasks: Task[]
}

export default function UpcomingTasksPanel({ tasks }: UpcomingTasksPanelProps) {
    const getStatusIcon = (status: Task['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />
            case 'in-progress':
                return <ClockIcon className="h-5 w-5 text-yellow-500" />
            default:
                return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
        }
    }

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-green-100 text-green-800'
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Tareas Próximas</h3>
            <div className="space-y-4">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            {getStatusIcon(task.status)}
                            <div>
                                <h4 className="font-medium">{task.title}</h4>
                                <p className="text-sm text-gray-500">
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
    )
} 