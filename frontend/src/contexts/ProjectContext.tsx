import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Project {
  id: number;
  name: string;
  description: string;
  documentCount: number;
  createdAt: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  getProject: (id: number) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = "docuchat_projects";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Load projects from localStorage on initial render
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored projects:", e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, "id">) => {
    // Find the highest existing ID and add 1
    const maxId = projects.length > 0 
      ? Math.max(...projects.map(p => p.id)) 
      : 0;
    
    const newProject: Project = {
      ...project,
      id: maxId + 1, // Incremental ID: 1, 2, 3, 4...
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const deleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getProject = (id: number) => {
    return projects.find(project => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, updateProject, deleteProject, getProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}