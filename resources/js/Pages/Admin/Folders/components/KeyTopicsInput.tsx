import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    topics: string[];
    onChange: (topics: string[]) => void;
}

export default function KeyTopicsInput({ topics, onChange }: Props) {
    function handleChange(index: number, value: string) {
        const updated = [...topics];
        updated[index] = value;
        onChange(updated);
    }

    function handleAdd() {
        onChange([...topics, ""]);
    }

    function handleRemove(index: number) {
        onChange(topics.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3">
            <Label>Key topics covered (optional)</Label>
            <div className="space-y-3">
                {topics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <Input
                            value={topic}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            placeholder="e.g. Code of Discipline"
                        />
                        {topics.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemove(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <Button type="button" variant="ghost" size="sm" onClick={handleAdd}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add another
            </Button>
        </div>
    );
}
