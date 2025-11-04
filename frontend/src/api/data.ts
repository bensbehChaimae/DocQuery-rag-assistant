import { API_BASE_URL, API_ENDPOINTS } from "./config";

export interface ProcessParams {
  chunk_size: number;
  overlap_size: number;
  do_reset: number; // 0 or 1
}

export interface UploadResponse {
  success: boolean;
  file_id: string;
  message?: string;
}

export interface ProcessResponse {
  success: boolean;
  message?: string;
}

// Health check
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.health}`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}

// Upload file
export async function uploadFile(
  projectId: string,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.uploadData(projectId)}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || "Upload failed");
  }

  return response.json();
}

// Process and push to vector database
export async function processAndPush(
  projectId: string,
  fileId: string,
  params: ProcessParams
): Promise<ProcessResponse> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.processAndPush(projectId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_id: fileId,
        ...params,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Processing failed" }));
    throw new Error(error.message || "Processing failed");
  }

  return response.json();
}