# Planificador de Oficinas

Aplicación web para la gestión de tareas y proyectos en entornos de oficina.

## Características

- 📋 Gestión de tareas y subtareas
- 📅 Calendario integrado
- 👥 Gestión de usuarios y equipos
- 🏷️ Etiquetado de tareas
- 📊 Dashboard con estadísticas
- 💬 Sistema de comentarios
- 🔄 Sincronización en tiempo real

## Tecnologías

### Frontend
- React
- TypeScript
- Tailwind CSS
- D3.js (para gráficos)
- React Router
- React Query

### Backend
- Node.js
- Express
- Supabase (PostgreSQL)
- Prisma ORM

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta en Supabase

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/planificador-oficinas.git
cd planificador-oficinas
```

2. Instalar dependencias del backend:
```bash
cd backend
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus credenciales de Supabase.

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
planificador-oficinas/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── prisma/
│   └── package.json
└── README.md
```

## Configuración de la Base de Datos

1. Crear una cuenta en Supabase
2. Crear un nuevo proyecto
3. Configurar las variables de entorno con las credenciales de Supabase
4. Ejecutar el script de creación de tablas:
```bash
node src/scripts/createTables.js
```

## Contribuir

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tu-twitter](https://twitter.com/tu-twitter)

Link del Proyecto: [https://github.com/tu-usuario/planificador-oficinas](https://github.com/tu-usuario/planificador-oficinas)

