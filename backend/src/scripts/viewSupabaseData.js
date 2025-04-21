import 'dotenv/config';
import { supabase } from '../config/supabase.js';

async function viewSupabaseData() {
    try {
        // Obtener usuarios
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*');

        if (usersError) throw usersError;
        console.log('Usuarios:', users);

        // Obtener tareas
        const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*');

        if (tasksError) throw tasksError;
        console.log('Tareas:', tasks);

        // Obtener proyectos
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*');

        if (projectsError) throw projectsError;
        console.log('Proyectos:', projects);

    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error.message);
    }
}

viewSupabaseData(); 