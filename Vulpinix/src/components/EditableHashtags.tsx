import { useState } from "react";
import { Hash, Edit2, Check, X, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface EditableHashtagsProps {
  hashtags: string[];
  onUpdate: (newHashtags: string[]) => void;
}

export function EditableHashtags({ hashtags, onUpdate }: EditableHashtagsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newHashtag, setNewHashtag] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAddHashtag = () => {
    if (newHashtag.trim()) {
      const formattedHashtag = newHashtag.startsWith("#")
        ? newHashtag
        : `#${newHashtag}`;
      onUpdate([...hashtags, formattedHashtag]);
      setNewHashtag("");
      toast.success("Hashtag added!");
    }
  };

  const handleRemoveHashtag = (index: number) => {
    onUpdate(hashtags.filter((_, i) => i !== index));
    toast.success("Hashtag removed!");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleDone = () => {
    setIsEditing(false);
    toast.success("Hashtags updated!");
  };

  return (
    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-cyan-400" />
          <h4 style={{ color: "var(--vx-text-primary)" }} className="font-medium">Hashtags</h4>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="text-cyan-400 hover:text-cyan-300"
            onClick={handleEdit}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {hashtags.map((tag, i) => (
          <span
            key={i}
            className="text-xs text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            {isEditing && (
              <button
                onClick={() => handleRemoveHashtag(i)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditing && (
        <div className="space-y-2 mt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 rounded-lg border-2 text-sm transition-all"
              style={{ 
                background: "var(--vx-bg-input)", 
                borderColor: "var(--vx-border)",
                color: "var(--vx-text-primary)" 
              }}
              placeholder="Add tag..."
            />
            <Button
              size="sm"
              onClick={handleAddHashtag}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button
            size="sm"
            onClick={handleDone}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-3 py-1 text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            Done
          </Button>
        </div>
      )}
    </div>
  );
}
