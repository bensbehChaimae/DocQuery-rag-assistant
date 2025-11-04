import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Folder, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: number;
  name: string;
  description: string;
  documentCount: number;
  createdAt: string;
}



export default function Workspace() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  


  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Research Papers",
      description: "Collection of academic papers on machine learning",
      documentCount: 3,
      createdAt: "2025-11-4"
    },
    {
      id: 2,
      name: "Legal Documents",
      description: "Contract reviews and legal documentation",
      documentCount: 2,
      createdAt: "2025-11-6"
    }
  ]);


  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    const newProject: Project = {
      id: projects.length + 1,
      name: newProjectName,
      description: newProjectDescription,
      documentCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");
    setNewProjectDescription("");
    setIsCreateModalOpen(false);
    toast.success("Project created successfully");
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen dark bg-background">
      <Header />
      
      <main className="container py-12 mt-8">


        {/* Page Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl !text-primary font-bold">Your Projects</h1>
          <p className="text-lg text-muted-foreground">
            Manage your document projects and collaborate with your team
          </p>
        </div>


        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="dark">
              <DialogHeader>
                <DialogTitle className="text-primary">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground font-bold" htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="Enter project name"
                    className="placeholder:text-muted-foreground/45 text-muted-foreground"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground font-bold" htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Enter project description"
                    className="placeholder:text-muted-foreground/45 text-muted-foreground"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="text-muted-foreground flex justify-end gap-3 pt-4">
                  <Button className="hover:bg-red-600" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-primary" onClick={handleCreateProject}>
                    Create Project
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>


        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <Card 
              key={project.id}
              className="glass hover:shadow-glow transition-smooth cursor-pointer group"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Folder className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{project.documentCount} documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button className="w-full gradient-primary">
                  Open Project
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Create New Project Card */}
          <Card 
            className="border-dashed border-2 hover:border-primary hover:shadow-glow transition-smooth cursor-pointer group"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-center">New Project</p>
            </CardContent>
          </Card>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No projects found</p>
          </div>
        )}
      </main>
    </div>
  );
}
