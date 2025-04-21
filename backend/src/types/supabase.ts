export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string
                    role: 'USER' | 'ADMIN'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    name: string
                    role?: 'USER' | 'ADMIN'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string
                    role?: 'USER' | 'ADMIN'
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    owner_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    owner_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    owner_id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
                    due_date: string | null
                    project_id: string
                    assignee_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
                    due_date?: string | null
                    project_id: string
                    assignee_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
                    due_date?: string | null
                    project_id?: string
                    assignee_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            subtasks: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    task_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    task_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    status?: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
                    task_id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            labels: {
                Row: {
                    id: string
                    name: string
                    color: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    color: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    color?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            task_labels: {
                Row: {
                    task_id: string
                    label_id: string
                }
                Insert: {
                    task_id: string
                    label_id: string
                }
                Update: {
                    task_id?: string
                    label_id?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    content: string
                    task_id: string
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    content: string
                    task_id: string
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    content?: string
                    task_id?: string
                    user_id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'USER' | 'ADMIN'
            task_status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED'
            task_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
        }
    }
} 