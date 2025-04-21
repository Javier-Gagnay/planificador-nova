import { useState } from 'react'
import Sidebar from './Sidebar'
import TaskDonutChart from './TaskDonutChart'
import TaskAssigneeBarChart from './TaskAssigneeBarChart'
import UpcomingTasksPanel from './UpcomingTasksPanel'

// Dummy data for charts and tasks
const taskStatusData = [
    { status: 'Completadas', count: 8, color: '#10B981' },
    { status: 'En Progreso', count: 5, color: '#F59E0B' },
    { status: 'Pendientes', count: 3, color: '#3B82F6' },
    { status: 'Atrasadas', count: 2, color: '#EF4444' }
]

const assigneeData = [
    { assignee: 'Juan Pérez', count: 5, color: '#3B82F6' },
    { assignee: 'María García', count: 4, color: '#10B981' },
    { assignee: 'Carlos López', count: 3, color: '#F59E0B' },
    { assignee: 'Ana Martínez', count: 2, color: '#EF4444' }
]

const upcomingTasks = [
    {
        id: '1',
        title: 'Revisar documentación del proyecto',
        dueDate: '2024-03-15',
        status: 'pending',
        priority: 'high'
    },
    {
        id: '2',
        title: 'Preparar presentación para el cliente',
        dueDate: '2024-03-16',
        status: 'in-progress',
        priority: 'medium'
    },
    {
        id: '3',
        title: 'Actualizar base de datos',
        dueDate: '2024-03-17',
        status: 'pending',
        priority: 'low'
    }
]

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [selectedProject, setSelectedProject] = useState('1')

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                selectedProject={selectedProject}
                onSelectProject={setSelectedProject}
            />

            {/* Main Content */}
            <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <TaskDonutChart data={taskStatusData} />
                        <TaskAssigneeBarChart data={assigneeData} />
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <UpcomingTasksPanel tasks={upcomingTasks} />
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-semibold mb-4">Resumen del Proyecto</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Progreso Total</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">65% completado</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tiempo Restante</p>
                                    <p className="text-lg font-semibold">15 días</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Miembros del Equipo</p>
                                    <p className="text-lg font-semibold">8 personas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 