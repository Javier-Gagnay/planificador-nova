import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'

function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
                <div className="flex items-center justify-between p-4">
                    <h1 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Office Planner</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isSidebarOpen ? '←' : '→'}
                    </button>
                </div>
                <nav className="mt-8">
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="flex items-center p-4 hover:bg-gray-100">
                                <span className="mr-3">📊</span>
                                <span className={isSidebarOpen ? 'block' : 'hidden'}>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/tasks" className="flex items-center p-4 hover:bg-gray-100">
                                <span className="mr-3">✅</span>
                                <span className={isSidebarOpen ? 'block' : 'hidden'}>Tasks</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/calendar" className="flex items-center p-4 hover:bg-gray-100">
                                <span className="mr-3">📅</span>
                                <span className={isSidebarOpen ? 'block' : 'hidden'}>Calendar</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className="flex items-center p-4 hover:bg-gray-100">
                                <span className="mr-3">⚙️</span>
                                <span className={isSidebarOpen ? 'block' : 'hidden'}>Settings</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout 