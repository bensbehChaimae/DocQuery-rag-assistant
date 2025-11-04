import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "uploaded" | "processing" | "indexed" | "error";
  projectId: string; // Link files to projects
}

interface FilesContextType {
  files: UploadedFile[];
  addFile: (file: Omit<UploadedFile, "id">) => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  deleteFile: (id: string) => void;
  getFilesByProject: (projectId: string) => UploadedFile[];
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

const STORAGE_KEY = "docuchat_files";

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<UploadedFile[]>(() => {
    // Load files from localStorage on initial render
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored files:", e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  const addFile = (file: Omit<UploadedFile, "id">) => {
    const newFile: UploadedFile = {
      ...file,
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setFiles(prev => [...prev, newFile]);
  };

  const updateFile = (id: string, updates: Partial<UploadedFile>) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFilesByProject = (projectId: string) => {
    return files.filter(file => file.projectId === projectId);
  };

  return (
    <FilesContext.Provider
      value={{ files, addFile, updateFile, deleteFile, getFilesByProject }}
    >
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
}