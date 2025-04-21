import React from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/lib/store";
import { Progress } from "@/components/ui/progress";

const Subtasks = ({ taskId, subtasks }) => {
    const { addSubtask, toggleSubtask } = useProjectStore();
    const [newSubtask, setNewSubtask] = React.useState("");

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (newSubtask.trim()) {
            addSubtask(taskId, newSubtask.trim());
            setNewSubtask("");
        }
    };

    const completedCount = subtasks.filter((subtask) => subtask.completed).length;
    const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Subtareas</h4>
                <div className="text-sm text-muted-foreground">
                    {completedCount} de {subtasks.length} completadas
                </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="space-y-2">
                {subtasks.map((subtask) => (
                    <div
                        key={subtask.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50"
                    >
                        <button
                            onClick={() => toggleSubtask(taskId, subtask.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center ${subtask.completed
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-border"
                                }`}
                        >
                            {subtask.completed && <Check className="w-3 h-3" />}
                        </button>
                        <span
                            className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : ""
                                }`}
                        >
                            {subtask.title}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Nueva subtarea"
                    className="flex-1 p-2 text-sm rounded bg-background border"
                />
                <Button type="submit" size="sm">
                    <Plus className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default Subtasks; 