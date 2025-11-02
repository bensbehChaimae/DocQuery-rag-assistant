import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, MessageSquare, Database, Zap, Shield, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Documents",
      description: "Drag and drop your PDF, DOCX, or TXT files. We support multiple document formats."
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Our advanced RAG system chunks, indexes, and vectorizes your documents for intelligent retrieval."
    },
    {
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Chat naturally with your documents. Get accurate answers powered by semantic search and LLM technology."
    }
  ];

  const technologies = [
    { icon: Brain, name: "RAG Architecture", description: "Retrieval-Augmented Generation" },
    { icon: Database, name: "Vector Database", description: "Semantic search at scale" },
    { icon: Zap, name: "FastAPI Backend", description: "High-performance async API" },
    { icon: Shield, name: "Secure Processing", description: "Enterprise-grade security" }
  ];

  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const generatedStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setStars(generatedStars);

    // Animate stars
    const interval = setInterval(() => {
      setStars(prevStars =>
        prevStars.map(star => ({
          ...star,
          x: (star.x + star.speedX + 100) % 100,
          y: (star.y + star.speedY + 100) % 100,
          opacity: 0.3 + Math.abs(Math.sin(Date.now() * 0.001 + star.id)) * 0.5
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen dark bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero -mt-20 pt-20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Animated Stars */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white transition-all duration-100"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity
              }}
            />
          ))}
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-pulse-slow" />
        </div>
        
        <div className="container relative z-10">
          <div className="flex flex-col items-center justify-center text-center py-20 lg:py-32">
            <div className="space-y-8 animate-fade-in max-w-4xl">
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium text-primary">AI-Powered Document Intelligence</span>
              </div>
              <motion.h1
                className="text-5xl lg:text-7xl font-bold leading-tight"
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.2, // ⚡ faster
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <motion.span
                  className="text-hero"
                  animate={{
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 1, // ⚡ faster flicker
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Welcome to
                </motion.span>{" "}
                <motion.span
                  className="text-primary"
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 1.2, // ⚡ synced with float
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  DocQuery
                </motion.span>
              </motion.h1>
              
              <p className="text-xl text-hero-secondary max-w-2xl mx-auto">
                Your intelligent RAG chatbot assistant. Transform static documents into dynamic conversations with advanced AI technology.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/workspace" className="group relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-primary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <Button size="lg" className="relative gradient-primary shadow-glow text-lg h-14 px-8 hover:scale-105 transition-transform duration-200">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
             <motion.h2
              className="text-4xl lg:text-5xl font-bold text-section-title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              How It <span className="text-primary">Works</span>
            </motion.h2>
            <p className="text-xl text-section-subtitle max-w-2xl mx-auto">
              Three simple steps to unlock the power of your documents
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="glass hover:shadow-glow transition-smooth group">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-smooth">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-primary/20">0{index + 1}</span>
                    <h3 className="text-2xl font-bold text-card">{step.title}</h3>
                  </div>
                  <p className="text-card leading-relaxed opacity-80">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="relative py-20 lg:py-32 bg-background overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="text-center space-y-4 mb-16">
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-section-title"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Powered by <span className="text-primary">Advanced Technology</span>
            </motion.h2>
            <p className="text-xl text-section-subtitle max-w-2xl mx-auto">
              Built on cutting-edge AI and cloud infrastructure
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="glass hover:shadow-glow transition-smooth group border-border/50 hover:border-primary/50">
                <CardContent className="p-8 space-y-4 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-glow">
                      <tech.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg mt-4 text-card group-hover:text-primary transition-colors">{tech.name}</h3>
                    <p className="text-sm text-card opacity-70 leading-relaxed">{tech.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-section-subtitle">© 2025 DocQuery. All rights reserved.</span>
            </div>
            <div className="flex text-section-subtitle items-center gap-6">
              <span>Built with passion for data and AI</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-bounce" />
              <span>& magic ✨</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}