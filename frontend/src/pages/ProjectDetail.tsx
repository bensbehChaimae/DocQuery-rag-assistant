import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadTab } from "@/components/project/UploadTab";
import { ChatTab } from "@/components/project/ChatTab";
import { SettingsTab } from "@/components/project/SettingsTab";
import { ArrowLeft, Upload, MessageSquare, Settings } from "lucide-react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-screen dark bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/workspace")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workspace
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Project {projectId}</h1>
          <p className="text-muted-foreground">Manage documents, chat, and configure settings</p>
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
