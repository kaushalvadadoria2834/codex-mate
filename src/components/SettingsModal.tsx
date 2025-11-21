import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectSettings } from "@/types";
import { Button } from "@/components/ui/button";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ProjectSettings;
  onSettingsChange: (settings: ProjectSettings) => void;
}

export const SettingsModal = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: SettingsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Configure your AI model and database connection
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Groq API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="gsk_..."
              value={settings.apiKey}
              onChange={(e) =>
                onSettingsChange({ ...settings, apiKey: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbUrl">Database Connection String</Label>
            <Input
              id="dbUrl"
              type="text"
              placeholder="postgresql://..."
              value={settings.databaseUrl}
              onChange={(e) =>
                onSettingsChange({ ...settings, databaseUrl: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select
              value={settings.model}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, model: value })
              }
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llama-3.1-70b-versatile">Llama 3.1 70B</SelectItem>
                <SelectItem value="llama-3.1-8b-instant">Llama 3.1 8B</SelectItem>
                <SelectItem value="llama3-70b-8192">Llama 3 70B</SelectItem>
                <SelectItem value="llama3-8b-8192">Llama 3 8B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Temperature: {settings.temperature.toFixed(2)}</Label>
            <Slider
              value={[settings.temperature]}
              onValueChange={([value]) =>
                onSettingsChange({ ...settings, temperature: value })
              }
              min={0}
              max={2}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Tokens: {settings.maxTokens}</Label>
            <Slider
              value={[settings.maxTokens]}
              onValueChange={([value]) =>
                onSettingsChange({ ...settings, maxTokens: value })
              }
              min={256}
              max={8192}
              step={256}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
