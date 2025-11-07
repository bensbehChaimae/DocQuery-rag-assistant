import { API_BASE_URL } from "./config";

// ============================================
// TYPES
// ============================================

export interface IndexInfo {
  project_id: string;
  total_documents?: number;
  total_chunks?: number;
  [key: string]: any;
}

export interface SearchRequest {
  text: string;
  limit?: number;
}

export interface SearchResult {
  chunks?: Array<{
    text: string;
    score: number;
    metadata?: any;
  }>;
  [key: string]: any;
}

export interface AnswerRequest {
  text: string;
  limit?: number;
}

export interface AnswerResponse {
  answer?: string;
  sources?: string[];
  chunks?: Array<{
    text: string;
    score: number;
    metadata?: any;
  }>;
  [key: string]: any;
}

// ============================================
// API ENDPOINTS
// ============================================

const NLP_ENDPOINTS = {
  indexInfo: (projectId: string) => `/api/v1/nlp/index/info/${projectId}`,
  search: (projectId: string) => `/api/v1/nlp/index/search/${projectId}`,
  answer: (projectId: string) => `/api/v1/nlp/index/answer/${projectId}`,
};

// ============================================
// GET INDEX INFO
// ============================================

export async function getIndexInfo(projectId: string): Promise<IndexInfo> {
  console.log(`📊 Getting index info for project: ${projectId}`);
  console.log(`📍 URL: ${API_BASE_URL}${NLP_ENDPOINTS.indexInfo(projectId)}`);

  try {
    const response = await fetch(
      `${API_BASE_URL}${NLP_ENDPOINTS.indexInfo(projectId)}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    );

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);

    const responseText = await response.text();
    console.log(`📄 Raw response:`, responseText);

    if (!response.ok) {
      console.error(`❌ Get index info failed. Status: ${response.status}`);
      console.error(`   Response body:`, responseText);
      
      // If 404 or similar, it means no index exists yet
      if (response.status === 404 || response.status === 500) {
        console.warn(`⚠️  No index found for project ${projectId}. Upload and process documents first.`);
      }
      
      throw new Error(`Failed to get index info: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log(`✅ Index info retrieved:`, result);
    console.log(`   Documents: ${result.total_documents || 'N/A'}`);
    console.log(`   Chunks: ${result.total_chunks || 'N/A'}`);
    return result;

  } catch (error: any) {
    console.error("❌ Get index info error:", error);
    
    if (error.name === 'TypeError' && error.message === "Failed to fetch") {
      throw new Error("Network error: Cannot reach backend.");
    }
    
    throw error;
  }
}

// ============================================
// SEARCH INDEX
// ============================================

export async function searchIndex(
  projectId: string,
  request: SearchRequest
): Promise<SearchResult> {
  console.log(`🔍 Searching index for project: ${projectId}`);
  console.log(`📍 URL: ${API_BASE_URL}${NLP_ENDPOINTS.search(projectId)}`);
  console.log(`📤 Request:`, request);

  try {
    const response = await fetch(
      `${API_BASE_URL}${NLP_ENDPOINTS.search(projectId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          text: request.text,
          limit: request.limit || 5,
        }),
      }
    );

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);

    const responseText = await response.text();
    console.log(`📄 Raw response:`, responseText);

    if (!response.ok) {
      console.error(`❌ Search failed. Status: ${response.status}`);
      throw new Error(`Search failed: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log(`✅ Search results:`, result);
    return result;

  } catch (error: any) {
    console.error("❌ Search error:", error);
    
    if (error.name === 'TypeError' && error.message === "Failed to fetch") {
      throw new Error("Network error: Cannot reach backend.");
    }
    
    throw error;
  }
}

// ============================================
// GET ANSWER (RAG)
// ============================================

export async function getAnswer(
  projectId: string,
  request: AnswerRequest
): Promise<AnswerResponse> {
  console.log(`💬 Getting answer for project: ${projectId}`);
  console.log(`📍 URL: ${API_BASE_URL}${NLP_ENDPOINTS.answer(projectId)}`);
  console.log(`📤 Request:`, request);

  try {
    const response = await fetch(
      `${API_BASE_URL}${NLP_ENDPOINTS.answer(projectId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          text: request.text,
          limit: request.limit || 5,
        }),
      }
    );

    console.log(`📥 Response status: ${response.status} ${response.statusText}`);

    const responseText = await response.text();
    console.log(`📄 Raw response:`, responseText);

    if (!response.ok) {
      console.error(`❌ Get answer failed. Status: ${response.status}`);
      throw new Error(`Failed to get answer: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log(`✅ Answer received:`, result);
    return result;

  } catch (error: any) {
    console.error("❌ Get answer error:", error);
    
    if (error.name === 'TypeError' && error.message === "Failed to fetch") {
      throw new Error("Network error: Cannot reach backend.");
    }
    
    throw error;
  }
}

// ============================================
// COMPLETE RAG PIPELINE
// This executes all steps in order for chat
// ============================================

export async function completeRAGPipeline(
  projectId: string,
  question: string,
  searchLimit: number = 5
): Promise<{
  indexInfo: IndexInfo;
  searchResults: SearchResult;
  answer: AnswerResponse;
}> {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 Starting Complete RAG Pipeline");
  console.log(`   Project ID: ${projectId}`);
  console.log(`   Question: ${question}`);
  console.log("=".repeat(60));

  try {
    // Step 1: Get Index Info
    console.log("\n📊 Step 1/3: Getting index info...");
    const indexInfo = await getIndexInfo(projectId);
    console.log("✅ Step 1 complete");

    // Step 2: Search Index
    console.log("\n🔍 Step 2/3: Searching index...");
    const searchResults = await searchIndex(projectId, {
      text: question,
      limit: searchLimit,
    });
    console.log("✅ Step 2 complete");

    // Step 3: Get Answer
    console.log("\n💬 Step 3/3: Getting answer...");
    const answer = await getAnswer(projectId, {
      text: question,
      limit: searchLimit,
    });
    console.log("✅ Step 3 complete");

    console.log("\n" + "=".repeat(60));
    console.log("✅ RAG Pipeline Complete!");
    console.log("=".repeat(60) + "\n");

    return {
      indexInfo,
      searchResults,
      answer,
    };

  } catch (error: any) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ RAG Pipeline Failed!");
    console.error(`   Error: ${error.message}`);
    console.error("=".repeat(60) + "\n");
    throw error;
  }
}