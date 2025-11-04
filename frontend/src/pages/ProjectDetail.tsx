import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadTab } from "@/components/project/UploadTab";
import { ChatTab } from "@/components/project/ChatTab";
import { SettingsTab } from "@/components/project/SettingsTab";
import { ArrowLeft, Upload, MessageSquare, Settings, Folder, FileText, Calendar } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams(); // Get projectId from URL
  const [activeTab, setActiveTab] = useState("upload");
  const { getProject } = useProjects();

  // Get the actual project data from context
  const project = getProject(Number(projectId));

  // If project not found, show error or redirect
  if (!project) {
    return (
      <div className="min-h-screen dark bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/workspace")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workspace
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button - Pill Style */}
        <Button 
          variant="outline"
          className="mb-6 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary rounded-full"
          onClick={() => navigate("/workspace")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workspace
        </Button>

        {/* Project Header Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-border rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-6">
            {/* Left Side - Icon, Title, Description */}
            <div className="flex items-start gap-4 flex-1">
              {/* Gradient Folder Icon */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                <Folder className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  {project.name}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
            
            {/* Right Side - Stats Stacked */}
            <div className="flex flex-col gap-2 w-48">
              <div className="bg-background/50 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-0.5">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Documents</span>
                </div>
                <p className="text-xs font-bold !text-center text-foreground mt-1">{project.documentCount} docs </p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-0.5">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-xs !text-center font-semibold text-foreground mt-1 leading-tight">
                  {new Date(project.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 glass">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <UploadTab projectId={projectId || ""} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatTab projectId={projectId || ""} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab projectId={projectId || ""} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}