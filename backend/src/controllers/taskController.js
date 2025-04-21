import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                project: true,
                assignee: true,
                subtasks: true,
                labels: true,
                comments: {
                    include: {
                        user: true
                    }
                }
            }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id },
            include: {
                project: true,
                assignee: true,
                subtasks: true,
                labels: true,
                comments: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!task) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId,
                assigneeId
            },
            include: {
                project: true,
                assignee: true,
                subtasks: true,
                labels: true
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate, projectId, assigneeId } = req.body;
        const task = await prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                projectId,
                assigneeId
            },
            include: {
                project: true,
                assignee: true,
                subtasks: true,
                labels: true
            }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
}; 