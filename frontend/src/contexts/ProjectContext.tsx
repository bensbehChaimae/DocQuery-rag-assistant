import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Document, ChatMessage } from '../types';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  documents: Document[];
  chatHistory: ChatMessage[];
  createProject: (name: string, description?: string) => Promise<Project>;
  selectProject: (projectId: string) => void;
  uploadDocument: (file: File) => Promise<void>;
  addDocumentToProject: (projectId: string, document: Partial<Document>) => void;
  updateDocumentStatus: (projectId: string, documentId: string, status: Document['status']) => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Store documents for each project
  const [projectDocuments, setProjectDocuments] = useState<Record<string, Document[]>>({});

  // Mock data for demonstration
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Research Papers',
        description: 'Collection of AI research papers',
        created_date: '2024-01-15',
        document_count: 0,
        last_activity: '2024-01-20'
      },
      {
        id: '2',
        name: 'Company Docs',
        description: 'Internal documentation',
        created_date: '2024-01-10',
        document_count: 0,
        last_activity: '2024-01-18'
      }
    ];
    setProjects(mockProjects);
  }, []);

  const createProject = async (name: string, description?: string): Promise<Project> => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      created_date: new Date().toISOString().split('T')[0],
      document_count: 0,
      last_activity: new Date().toISOString().split('T')[0]
    };
    
    setProjects(prev => [...prev, newProject]);
    setProjectDocuments(prev => ({ ...prev, [newProject.id]: [] }));
    return newProject;
  };

  const selectProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const documents = projectDocuments[projectId] || [];
      setCurrentProject({
        ...project,
        documents: documents,
        document_count: documents.length
      });
      setChatHistory([]);
    }
  };

  const addDocumentToProject = (projectId: string, documentData: Partial<Document>) => {
  const newDoc: Document = {
    id: documentData.id || (Date.now().toString() + Math.random()),
    name: documentData.name || 'Unknown',
    size: documentData.size || 0,
    type: documentData.type || 'application/octet-stream',
    status: documentData.status || 'processing',
    uploadedAt: documentData.uploadedAt || new Date().toISOString(),
    uploaded_date: documentData.uploaded_date || new Date().toISOString().split('T')[0]
  };

  setProjectDocuments(prev => {
    const existingDocs = prev[projectId] || [];
    
    // Avoid duplicates by checking ID
    const docExists = existingDocs.some(d => d.id === newDoc.id);
    const updatedDocs = docExists ? existingDocs.map(d => d.id === newDoc.id ? newDoc : d) : [...existingDocs, newDoc];

    // Also update currentProject in the same function to keep in sync
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        documents: updatedDocs,
        document_count: updatedDocs.length,
        last_activity: new Date().toISOString().split('T')[0]
      } : null);
    }

    return { ...prev, [projectId]: updatedDocs };
  });

  // Update project list metadata
  setProjects(prev => prev.map(project => 
    project.id === projectId
      ? { ...project, document_count: (prev.find(p => p.id === projectId)?.document_count || 0) + 1, last_activity: new Date().toISOString().split('T')[0] }
      : project
  ));
};


  const updateDocumentStatus = (projectId: string, documentId: string, status: Document['status']) => {
    // Update in project documents
    setProjectDocuments(prev => ({
      ...prev,
      [projectId]: (prev[projectId] || []).map(doc =>
        doc.id === documentId ? { ...doc, status } : doc
      )
    }));

    // Update current project if it matches
    if (currentProject && currentProject.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        documents: (prev.documents || []).map(doc =>
          doc.id === documentId ? { ...doc, status } : doc
        )
      } : null);
    }
  };

  const uploadDocument = async (file: File) => {
    if (!currentProject) return;

    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      uploadedAt: new Date().toISOString(),
      uploaded_date: new Date().toISOString().split('T')[0]
    };

    addDocumentToProject(currentProject.id, newDoc);

    // Simulate upload and processing
    setTimeout(() => {
      updateDocumentStatus(currentProject.id, newDoc.id, 'processing');
    }, 1000);

    setTimeout(() => {
      updateDocumentStatus(currentProject.id, newDoc.id, 'ready');
    }, 3000);
  };

  const sendMessage = async (message: string) => {
    if (!currentProject) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      type: 'ai',
      content: '',
      timestamp: new Date().toISOString(),
      isTyping: true
    };

    setChatHistory(prev => [...prev, typingMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your documents, here's what I found about "${message}". This information comes from your uploaded research papers and documentation.`,
        timestamp: new Date().toISOString(),
        references: [
          {
            document_name: 'research-paper-1.pdf',
            chunk_id: 'chunk_1',
            snippet: 'Relevant excerpt from the document...',
            score: 0.85
          },
          {
            document_name: 'documentation.txt',
            chunk_id: 'chunk_3',
            snippet: 'Another relevant section...',
            score: 0.78
          }
        ]
      };

      setChatHistory(prev => prev.filter(msg => msg.id !== 'typing').concat(aiMessage));
    }, 2000);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      documents: currentProject?.documents || [],
      chatHistory,
      createProject,
      selectProject,
      uploadDocument,
      addDocumentToProject,
      updateDocumentStatus,
      sendMessage,
      clearChat,
      isLoading
    }}>
      {children}
    </ProjectContext.Provider>
  );
};