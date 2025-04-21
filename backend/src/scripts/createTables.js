import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
    try {
        // Crear tabla de usuarios
        let { data: users, error: usersError } = await supabase
            .from('users')
            .insert([
                {
                    email: 'admin@example.com',
                    full_name: 'Admin User',
                }
            ])
            .select();

        if (usersError) {
            if (usersError.code === '42P01') {
                console.log('Creando tabla users...');
                const { error } = await supabase.schema.createTable('users', {
                    id: 'uuid primary key default uuid_generate_v4()',
                    email: 'text unique not null',
                    full_name: 'text',
                    avatar_url: 'text',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null'
                });
                if (error) throw error;
                console.log('✅ Tabla users creada');
            } else {
                throw usersError;
            }
        } else {
            console.log('✅ Tabla users ya existe');
        }

        // Crear tabla de proyectos
        let { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .limit(1);

        if (projectsError) {
            if (projectsError.code === '42P01') {
                console.log('Creando tabla projects...');
                const { error } = await supabase.schema.createTable('projects', {
                    id: 'uuid primary key default uuid_generate_v4()',
                    name: 'text not null',
                    description: 'text',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null',
                    created_by: 'uuid references users(id)'
                });
                if (error) throw error;
                console.log('✅ Tabla projects creada');
            } else {
                throw projectsError;
            }
        } else {
            console.log('✅ Tabla projects ya existe');
        }

        // Crear tabla de tareas
        let { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .limit(1);

        if (tasksError) {
            if (tasksError.code === '42P01') {
                console.log('Creando tabla tasks...');
                const { error } = await supabase.schema.createTable('tasks', {
                    id: 'uuid primary key default uuid_generate_v4()',
                    title: 'text not null',
                    description: 'text',
                    status: 'text not null',
                    priority: 'text not null',
                    due_date: 'timestamp with time zone',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null',
                    project_id: 'uuid references projects(id)',
                    assignee_id: 'uuid references users(id)',
                    created_by: 'uuid references users(id)'
                });
                if (error) throw error;
                console.log('✅ Tabla tasks creada');
            } else {
                throw tasksError;
            }
        } else {
            console.log('✅ Tabla tasks ya existe');
        }

        // Crear tabla de subtareas
        let { data: subtasks, error: subtasksError } = await supabase
            .from('subtasks')
            .select('*')
            .limit(1);

        if (subtasksError) {
            if (subtasksError.code === '42P01') {
                console.log('Creando tabla subtasks...');
                const { error } = await supabase.schema.createTable('subtasks', {
                    id: 'uuid primary key default uuid_generate_v4()',
                    title: 'text not null',
                    completed: 'boolean default false',
                    task_id: 'uuid references tasks(id) on delete cascade',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null'
                });
                if (error) throw error;
                console.log('✅ Tabla subtasks creada');
            } else {
                throw subtasksError;
            }
        } else {
            console.log('✅ Tabla subtasks ya existe');
        }

        // Crear tabla de etiquetas
        let { data: labels, error: labelsError } = await supabase
            .from('labels')
            .select('*')
            .limit(1);

        if (labelsError) {
            if (labelsError.code === '42P01') {
                console.log('Creando tabla labels...');
                const { error } = await supabase.schema.createTable('labels', {
                    id: 'uuid primary key default uuid_generate_v4()',
                    name: 'text not null',
                    color: 'text not null',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null'
                });
                if (error) throw error;
                console.log('✅ Tabla labels creada');
            } else {
                throw labelsError;
            }
        } else {
            console.log('✅ Tabla labels ya existe');
        }

        // Crear tabla de relación entre tareas y etiquetas
        let { data: taskLabels, error: taskLabelsError } = await supabase
            .from('task_labels')
            .select('*')
            .limit(1);

        if (taskLabelsError) {
            if (taskLabelsError.code === '42P01') {
                console.log('Creando tabla task_labels...');
                const { error } = await supabase.schema.createTable('task_labels', {
                    task_id: 'uuid references tasks(id) on delete cascade',
                    label_id: 'uuid references labels(id) on delete cascade',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null',
                    'primary key': '(task_id, label_id)'
                });
                if (error) throw error;
                console.log('✅ Tabla task_labels creada');
            } else {
                throw taskLabelsError;
            }
        } else {
            console.log('✅ Tabla task_labels ya existe');
        }

        // Crear tabla de comentarios
        let { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select('*')
            .limit(1);

        if (commentsError) {
            if (commentsError.code === '42P01') {
                console.log('Creando tabla comments...');
                const { error } = await supabase.schema.createTable('comments', {
                    id: 'uuid primary key default uuid_generate_v4()',
                    content: 'text not null',
                    task_id: 'uuid references tasks(id) on delete cascade',
                    user_id: 'uuid references users(id)',
                    created_at: 'timestamp with time zone default timezone(\'utc\'::text, now()) not null'
                });
                if (error) throw error;
                console.log('✅ Tabla comments creada');
            } else {
                throw commentsError;
            }
        } else {
            console.log('✅ Tabla comments ya existe');
        }

        console.log('✨ Proceso de creación de tablas completado');

    } catch (error) {
        console.error('Error al crear las tablas:', error.message);
    }
}

createTables(); 