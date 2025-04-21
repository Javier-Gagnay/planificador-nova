import { useState } from 'react'
import { FolderIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface Project {
    id: string
    name: string
    icon: string
}

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
    selectedProject: string | null
    onSelectProject: (projectId: string) => void
}

const dummyProjects: Project[] = [
    { id: '1', name: 'Proyecto Principal', icon: '📊' },
    { id: '2', name: 'Desarrollo Web', icon: '💻' },
    { id: '3', name: 'Marketing', icon: '📢' },
    { id: '4', name: 'Recursos Humanos', icon: '👥' }
]

export default function Sidebar({ isOpen, onToggle, selectedProject, onSelectProject }: SidebarProps) {
    const [showNewProjectForm, setShowNewProjectForm] = useState(false)
    const [newProjectName, setNewProjectName] = useState('')

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement project creation logic
        setShowNewProjectForm(false)
        setNewProjectName('')
    }

    return (
        <div
            className={`fixed md:relative bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'
                } h-full z-10`}
        >
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
            >
                {isOpen ? (
                    <ChevronLeftIcon className="h-5 w-5" />
                ) : (
                    <ChevronRightIcon className="h-5 w-5" />
                )}
            </button>

            <div className="p-4">
                <h2 className={`text-xl font-bold mb-4 ${!isOpen && 'hidden'}`}>Proyectos</h2>

                {/* Project List */}
                <div className="space-y-2">
                    {dummyProjects.map((project) => (
                        <button
                            key={project.id}
                            onClick={() => onSelectProject(project.id)}
                            className={`flex items-center w-full p-2 rounded-lg transition-colors ${selectedProject === project.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'hover:bg-gray-100'
                                }`}
                        >
                            <span className="mr-3">{project.icon}</span>
                            <span className={!isOpen ? 'hidden' : ''}>{project.name}</span>
                        </button>
                    ))}
                </div>

                {/* New Project Button */}
                <button
                    onClick={() => setShowNewProjectForm(true)}
                    className={`mt-4 flex items-center w-full p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ${!isOpen && 'justify-center'
                        }`}
                >
                    <PlusIcon className="h-5 w-5" />
                    {isOpen && <span className="ml-2">Nuevo Proyecto</span>}
                </button>

                {/* New Project Form Modal */}
                {showNewProjectForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">Crear Nuevo Proyecto</h3>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nombre del Proyecto
                                    </label>
                                    <input
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewProjectForm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 