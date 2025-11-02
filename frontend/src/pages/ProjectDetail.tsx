import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadTab } from "@/components/project/UploadTab";
import { ChatTab } from "@/components/project/ChatTab";
import { SettingsTab } from "@/components/project/SettingsTab";
import { ArrowLeft, Upload, MessageSquare, Settings, Folder, FileText, Calendar } from "lucide-react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");

  // Mock project data - replace with actual data fetching
  const projectData = {
    name: `Project ${projectId}`,
    description: "Contract reviews and legal documentation for corporate clients. This project contains all essential documents and correspondence related to ongoing legal matters.",
    documentCount: 8,
    createdAt: "2025-01-10"
  };

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
                  {projectData.name}
                </h1>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {projectData.description}
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
                <p className="text-xs font-bold !text-center text-foreground mt-1">{projectData.documentCount} docs </p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-0.5">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-xs !text-center font-semibold text-foreground mt-1 leading-tight">
                  {new Date(projectData.createdAt).toLocaleDateString('en-US', { 
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