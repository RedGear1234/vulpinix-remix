import { useState } from "react";
import { Target, Edit2, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { toast } from "sonner@2.0.3";
import { Instagram, Facebook, Youtube, Linkedin, Twitter } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: any;
  selected: boolean;
}

interface EditablePlatformsProps {
  selectedPlatforms: string[];
  onUpdate: (platforms: string[]) => void;
}

export function EditablePlatforms({
  selectedPlatforms,
  onUpdate,
}: EditablePlatformsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      selected: selectedPlatforms.includes("Instagram"),
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      selected: selectedPlatforms.includes("Facebook"),
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      selected: selectedPlatforms.includes("YouTube"),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      selected: selectedPlatforms.includes("LinkedIn"),
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      selected: selectedPlatforms.includes("Twitter"),
    },
  ]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const togglePlatform = (id: string) => {
    setPlatforms(
      platforms.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleSave = () => {
    const selected = platforms.filter((p) => p.selected).map((p) => p.name);
    onUpdate(selected);
    setIsEditing(false);
    toast.success("Platform recommendations updated!");
  };

  return (
    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-medium">Platforms</h4>
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
        <div className="space-y-3">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white">{platform.name}</span>
                </div>
                <Switch
                  checked={platform.selected}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
              </div>
            );
          })}
          <Button
            size="sm"
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-3 py-1 text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          {selectedPlatforms.map((platform, i) => (
            <p key={i} className="text-sm text-gray-300">
              ✓ {platform}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
