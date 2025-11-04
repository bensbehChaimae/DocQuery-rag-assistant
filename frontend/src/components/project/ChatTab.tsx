import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, User, Bot, Send, ChevronDown, Clock } from "lucide-react";
import { toast } from "sonner";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "What the document is about?",
    "Summarize the key findings",
    "What methodologies are discussed?",
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Mock AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a mock response. In production, this would connect to your RAG backend to provide answers based on your documents.",
        timestamp: new Date(),
        sources: ["research_paper.pdf - Page 3", "research_paper.pdf - Page 7"]
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Container */}
      <Card className="glass">
        <CardContent className="p-0">
          <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] max-h-[700px]">
            {/* Messages - Scrollable */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {messages.length === 1 && (
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
                            View Sources
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
                  placeholder="Ask anything about your documents..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="resize-none"
                  rows={3}
                />
                <Button
                  size="lg"
                  className="gradient-primary shadow-glow"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
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