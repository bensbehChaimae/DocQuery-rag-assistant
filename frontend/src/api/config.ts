// API base URL - change this to your backend URL
export const API_BASE_URL = "http://localhost:8000" ;

export const API_ENDPOINTS = {
  health: "/api/v1",
  uploadData: (projectId: string) => `/api/v1/data/upload/${projectId}`,
  processAndPush: (projectId: string) => `/api/v1/data/process-and-push/${projectId}`,

  // NLP endpoints (chat and search)
  indexInfo: (projectId: string) => `/api/v1/nlp/index/info/${projectId}`,
  search: (projectId: string) => `/api/v1/nlp/index/search/${projectId}`,
  answer: (projectId: string) => `/api/v1/nlp/index/answer/${projectId}`,
};

