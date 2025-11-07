import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, User, Bot, Send, ChevronDown, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { completeRAGPipeline, getIndexInfo } from "@/api/nlp";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface ChatTabProps {
  projectId: string;
}

export function ChatTab({ projectId }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your document assistant. Ask me anything about your uploaded documents.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [indexReady, setIndexReady] = useState(false);
  const [checkingIndex, setCheckingIndex] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if index is ready on mount
  useEffect(() => {
    checkIndexStatus();
  }, [projectId]);

  const checkIndexStatus = async () => {
    setCheckingIndex(true);
    console.log(`🔍 Checking if index is ready for project: ${projectId}`);
    
    try {
      const info = await getIndexInfo(projectId);
      console.log(`✅ Index is ready:`, info);
      setIndexReady(true);
      
      // Update welcome message if index has documents
      if (info.total_documents || info.total_chunks) {
        setMessages([{
          id: "1",
          role: "assistant",
          content: `Hello! I'm ready to help you with your documents. I have access to ${info.total_documents || 'your'} document(s). What would you like to know?`,
          timestamp: new Date(),
        }]);
      }
    } catch (error: any) {
      console.error(`❌ Index not ready:`, error);
      setIndexReady(false);
      setMessages([{
        id: "1",
        role: "assistant",
        content: "Please upload and process documents first before asking questions.",
        timestamp: new Date(),
      }]);
    } finally {
      setCheckingIndex(false);
    }
  };

  const suggestedQuestions = [
    "What is this document about?",
    "Summarize the key findings",
    "What methodologies are discussed?",
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!indexReady) {
      toast.error("Please upload and process documents first");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput("");
    setIsLoading(true);

    try {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`💬 User asked: "${question}"`);
      console.log(`${"=".repeat(60)}\n`);

      // Execute complete RAG pipeline
      const result = await completeRAGPipeline(projectId, question, 5);

      console.log(`\n📊 Pipeline Results:`);
      console.log(`   Index Info:`, result.indexInfo);
      console.log(`   Search Results:`, result.searchResults);
      console.log(`   Answer:`, result.answer);

      // Extract answer and sources from response
      let answerContent = "I couldn't find a specific answer in the documents.";
      let sources: string[] = [];

      // Try to extract answer from different possible response formats
      if (typeof result.answer === 'string') {
        answerContent = result.answer;
      } else if (result.answer?.answer) {
        answerContent = result.answer.answer;
      } else if (result.answer?.text) {
        answerContent = result.answer.text;
      }

      // Extract sources from answer or search results
      if (result.answer?.sources) {
        sources = result.answer.sources;
      } else if (result.answer?.chunks) {
        sources = result.answer.chunks.map((chunk: any, idx: number) => 
          `Source ${idx + 1} (Score: ${chunk.score?.toFixed(2) || 'N/A'})`
        );
      } else if (result.searchResults?.chunks) {
        sources = result.searchResults.chunks.map((chunk: any, idx: number) => 
          `Source ${idx + 1} (Score: ${chunk.score?.toFixed(2) || 'N/A'})`
        );
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answerContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined,
      };

      setMessages(prev => [...prev, aiMessage]);
      console.log(`✅ Answer displayed to user\n`);

    } catch (error: any) {
      console.error(`❌ Failed to get answer:`, error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please make sure your documents are properly indexed.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error(`Failed to get answer: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Index Status Banner */}
      {checkingIndex && (
        <Card className="glass border-blue-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Checking document index...</span>
          </CardContent>
        </Card>
      )}

      {!checkingIndex && !indexReady && (
        <Card className="glass border-yellow-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">
              No documents indexed yet. Please upload and process documents in the Upload tab first.
            </span>
          </CardContent>
        </Card>
      )}

      {!checkingIndex && indexReady && (
        <Card className="glass border-green-500/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Document index ready</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={checkIndexStatus}
              className="ml-auto"
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="glass">
        <CardContent className="p-0">
          <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] max-h-[700px]">
            {/* Messages - Scrollable */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {messages.length === 1 && indexReady && (
                <div className="text-center space-y-6 py-12">
                  <MessageSquare className="h-16 w-16 text-primary mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Ask anything about your documents</h3>
                    <p className="text-muted-foreground">Try one of these questions:</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {suggestedQuestions.map((question, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2"
                        onClick={() => setInput(question)}
                      >
                        {question}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  
                  <div className={`space-y-2 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-xl p-4 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "glass"
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    
                    {message.sources && (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                            View Sources ({message.sources.length})
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 pt-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs text-muted-foreground pl-4 border-l border-border">
                              {source}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground px-2">
                      <Clock className="h-3 w-3" />
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-border p-4 bg-background/95 backdrop-blur">
              <div className="flex gap-3">
                <Textarea
                  placeholder={
                    indexReady 
                      ? "Ask anything about your documents..." 
                      : "Upload documents first to start chatting..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="resize-none"
                  rows={3}
                  disabled={!indexReady || isLoading}
                />
                <Button
                  size="lg"
                  className="gradient-primary shadow-glow"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !indexReady}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}