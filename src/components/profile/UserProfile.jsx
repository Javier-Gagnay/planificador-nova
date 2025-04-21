import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Share2, Save } from "lucide-react";

const UserProfile = () => {
    const { userProfile, updateUserProfile, projects, shareProject } = useProjectStore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState(userProfile);
    const [shareEmail, setShareEmail] = React.useState("");
    const [selectedProject, setSelectedProject] = React.useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        updateUserProfile(formData);
        setIsEditing(false);
        toast({
            title: "Perfil actualizado",
            description: "Tus cambios han sido guardados correctamente.",
        });
    };

    const handleShareProject = () => {
        if (!selectedProject || !shareEmail) {
            toast({
                title: "Error",
                description: "Por favor, selecciona un proyecto y proporciona un email.",
                variant: "destructive",
            });
            return;
        }

        shareProject(selectedProject, shareEmail);
        setShareEmail("");
        toast({
            title: "Proyecto compartido",
            description: `Se ha compartido el proyecto con ${shareEmail}`,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Mi Perfil</h1>
                    <p className="text-muted-foreground">Gestiona tu información personal</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 rounded bg-background border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 rounded bg-background border"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Biografía</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 rounded bg-background border"
                        rows="4"
                    />
                </div>

                <div className="flex justify-end">
                    {isEditing ? (
                        <Button onClick={handleSaveProfile}>
                            <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                        </Button>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <User className="mr-2 h-4 w-4" /> Editar Perfil
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Compartir Proyectos</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Proyecto</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="w-full p-2 rounded bg-background border"
                        >
                            <option value="">Seleccionar proyecto</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email del usuario</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                placeholder="usuario@ejemplo.com"
                                className="flex-1 p-2 rounded bg-background border"
                            />
                            <Button onClick={handleShareProject}>
                                <Share2 className="mr-2 h-4 w-4" /> Compartir
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfile; 