import { Code2, Settings, FileUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TopNavigationProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  onSettingsClick: () => void;
  onNewProject: () => void;
  onExport: () => void;
}

export const TopNavigation = ({
  projectName,
  onProjectNameChange,
  onSettingsClick,
  onNewProject,
  onExport,
}: TopNavigationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);

  const handleNameSubmit = () => {
    onProjectNameChange(editedName);
    setIsEditing(false);
  };

  return (
    <header className="h-14 border-b border-panel-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">AI Coding Agent</h1>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        {isEditing ? (
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            className="h-8 w-48"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {projectName}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onNewProject}>
          <FileUp className="h-4 w-4 mr-2" />
          New Project
        </Button>
        <Button variant="ghost" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="ghost" size="sm" onClick={onSettingsClick}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
