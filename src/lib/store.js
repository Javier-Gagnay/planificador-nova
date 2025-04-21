import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  projects: [],
  tasks: [],
  labels: [
    { id: 1, name: '🔥 Urgente', color: 'red' },
    { id: 2, name: '⭐ Importante', color: 'yellow' },
    { id: 3, name: '📚 Documentación', color: 'blue' },
    { id: 4, name: '🐛 Bug', color: 'purple' },
    { id: 5, name: '💡 Idea', color: 'green' },
  ],
  sharedUsers: [],
  userProfile: {
    name: '',
    email: '',
    avatar: '',
    bio: '',
  },
};

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useProjectStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, {
            ...project,
            id: project.id || Date.now().toString()
          }]
        })),

      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId ? { ...project, ...updates } : project
          ),
        })),

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: task.id || Date.now().toString(),
              status: task.status || 'todo',
              subtasks: task.subtasks || [],
            },
          ],
        })),

      updateTask: (updatedTask) =>
        set((state) => {
          const taskExists = state.tasks.some(task => task.id === updatedTask.id);

          if (!taskExists) {
            return {
              tasks: [
                ...state.tasks,
                {
                  ...updatedTask,
                  id: updatedTask.id || Date.now().toString(),
                  status: updatedTask.status || 'todo',
                  subtasks: updatedTask.subtasks || [],
                },
              ],
            };
          }

          return {
            tasks: state.tasks.map((task) =>
              task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            ),
          };
        }),

      moveTask: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          ),
        })),

      addSubtask: (taskId, subtask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                ...task,
                subtasks: [
                  ...(task.subtasks || []),
                  { id: Date.now(), title: subtask, completed: false },
                ],
              }
              : task
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
                ),
              }
              : task
          ),
        })),

      getProjectTasks: (projectId) => {
        const state = get();
        return state.tasks.filter(task => task.projectId === projectId);
      },

      getTasksByUser: (email) => {
        const state = get();
        return state.tasks.filter(task => task.assignedTo === email);
      },

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),

      addLabel: (label) =>
        set((state) => ({
          labels: [...state.labels, label],
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'project-storage',
    }
  )
);
