import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sliders, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SettingsTabProps {
  projectId: string;
}

export function SettingsTab({ projectId }: SettingsTabProps) {
  const navigate = useNavigate();
  const [chunkSize, setChunkSize] = useState(100);
  const [overlapSize, setOverlapSize] = useState(20);
  const [autoIndex, setAutoIndex] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleDeleteProject = () => {
    toast.success("Project deleted");
    navigate("/workspace");
  };

  return (
    <div className="space-y-6">
      {/* Processing Settings */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <CardTitle>Processing Defaults</CardTitle>
          </div>
          <CardDescription>
            Configure default settings for document processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Default Chunk Size: {chunkSize}</Label>
            <Slider
              value={[chunkSize]}
              onValueChange={(value) => setChunkSize(value[0])}
              min={50}
              max={500}
              step={10}
            />
            <p className="text-sm text-muted-foreground">
              Number of tokens per chunk when processing documents
            </p>
          </div>

          <div className="space-y-3">
            <Label>Default Overlap Size: {overlapSize}</Label>
            <Slider
              value={[overlapSize]}
              onValueChange={(value) => setOverlapSize(value[0])}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-sm text-muted-foreground">
              Number of overlapping tokens between chunks
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="space-y-1">
              <Label>Auto-index documents</Label>
              <p className="text-sm text-muted-foreground">
                Automatically index documents after upload
              </p>
            </div>
            <Switch
              checked={autoIndex}
              onCheckedChange={setAutoIndex}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button className="gradient-primary" onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions for this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Delete Project</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this project and all its documents
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-500 hover:bg-red-600" variant="destructive">
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="dark">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    project and remove all associated documents from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-muted-foreground">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteProject}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
