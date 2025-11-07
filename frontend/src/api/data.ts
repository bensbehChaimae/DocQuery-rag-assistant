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
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.health}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error("Health check error:", error);
    throw new Error(`Health check failed: ${error.message}`);
  }
}

// Upload file
export async function uploadFile(
  projectId: string,
  file: File
): Promise<UploadResponse> {
  console.log(`📤 Uploading file: ${file.name} to project: ${projectId}`);
  console.log(`📍 URL: ${API_BASE_URL}${API_ENDPOINTS.uploadData(projectId)}`);
  
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.uploadData(projectId)}`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log(`📥 Response received:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   OK: ${response.ok}`);
    console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));
    
    // Try to get the response text first
    const responseText = await response.text();
    console.log(`📄 Raw response body:`, responseText);
    
    // Check if response is ok
    if (!response.ok) {
      console.error(`❌ Response not OK. Status: ${response.status}`);
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log(`✅ Parsed JSON response:`, result);
    } catch (parseError) {
      console.error(`❌ Failed to parse response as JSON:`, parseError);
      console.error(`   Response was:`, responseText);
      throw new Error(`Invalid JSON response from server: ${responseText}`);
    }
    
    // Validate response structure
    if (!result.file_id) {
      console.error(`❌ Response missing file_id:`, result);
      throw new Error(`Invalid response: missing file_id. Got: ${JSON.stringify(result)}`);
    }
    
    console.log(`✅ Upload successful! file_id: ${result.file_id}`);
    return result;
    
  } catch (error: any) {
    console.error("❌ Upload error:", error);
    console.error("   Error type:", error.constructor.name);
    console.error("   Error message:", error.message);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message === "Failed to fetch") {
      throw new Error("Network error: Cannot reach backend. Check if backend is running and CORS is configured.");
    }
    
    throw error;
  }
}

// Process and push to vector database
export async function processAndPush(
  projectId: string,
  fileId: string,
  params: ProcessParams
): Promise<ProcessResponse> {
  console.log(`⚙️ Processing file: ${fileId} in project: ${projectId}`);
  console.log(`📍 URL: ${API_BASE_URL}${API_ENDPOINTS.processAndPush(projectId)}`);
  console.log(`⚙️ Parameters:`, params);
  
  const requestBody = {
    file_id: fileId,
    chunk_size: params.chunk_size,
    overlap_size: params.overlap_size,
    do_reset: params.do_reset,
  };
  
  console.log(`📤 Request body:`, requestBody);

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.processAndPush(projectId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log(`📥 Response received:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   OK: ${response.ok}`);
    
    // Try to get the response text first
    const responseText = await response.text();
    console.log(`📄 Raw response body:`, responseText);

    if (!response.ok) {
      console.error(`❌ Response not OK. Status: ${response.status}`);
      throw new Error(`Processing failed with status: ${response.status}: ${responseText}`);
    }

    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
      console.log(`✅ Parsed JSON response:`, result);
    } catch (parseError) {
      console.error(`❌ Failed to parse response as JSON:`, parseError);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    console.log(`✅ Processing successful!`);
    return result;
    
  } catch (error: any) {
    console.error("❌ Processing error:", error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message === "Failed to fetch") {
      throw new Error("Network error: Cannot reach backend. Check if backend is running and CORS is configured.");
    }
    
    throw error;
  }
}