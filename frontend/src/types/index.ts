export interface Project {
  id: string;
  name: string;
  description?: string;
  created_date: string;
  document_count: number;
  last_activity: string;
  documents?: Document[];
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  uploaded_date: string;
  error_message?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  references?: DocumentReference[];
  isTyping?: boolean;
}

export interface DocumentReference {
  document_name: string;
  chunk_id: string;
  snippet: string;
  score?: number;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}