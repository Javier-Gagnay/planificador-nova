import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './components/dashboard/Dashboard'
import Tasks from './components/tasks/Tasks'
import Calendar from './components/calendar/Calendar'
import Settings from './components/settings/Settings'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}

export default App 