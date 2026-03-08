import { useState } from "react";
import { Sparkles, Edit2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface EditableCaptionProps {
  caption: string;
  onSave: (newCaption: string) => void;
}

export function EditableCaption({ caption, onSave }: EditableCaptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCaption, setTempCaption] = useState("");

  const handleEdit = () => {
    setTempCaption(caption);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (tempCaption.trim()) {
      onSave(tempCaption);
      setIsEditing(false);
      toast.success("Caption updated successfully!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempCaption("");
  };

  return (
    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-medium">Caption</h4>
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
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={tempCaption}
            onChange={(e) => setTempCaption(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border-2 border-purple-500/30 text-white text-sm placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition-all resize-none"
            placeholder="Enter your caption..."
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-3 py-1 text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-600 text-gray-400 hover:bg-gray-800 px-3 py-1 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-300">{caption}</p>
      )}
    </div>
  );
}
