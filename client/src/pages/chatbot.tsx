import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BannerAd, DisplayAd } from "@/components/ads/adsense-block";
import { AdSlot, ShopifyAffiliateBanner } from "@/components/ads/ad-slot";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "What's the best routine for acne-prone skin?",
  "Can I use retinol with vitamin C?",
  "How do I treat dark spots?",
  "What SPF should I use daily?",
  "Best ingredients for anti-aging?"
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm SKYNN's AI Virtual Dermatologist. I can help you with skincare concerns, product recommendations, and answer questions about ingredients and routines. How can I assist you today?",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await fetch("/api/chat/skynn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        content: data.response,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  });

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content: trimmedInput,
      role: "user",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    chatMutation.mutate(trimmedInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  useEffect(() => {
    scrollAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Top Banner Ad */}
        <BannerAd className="mb-6" />
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Skincare Assistant</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get personalized skincare advice powered by AI. Ask questions about products, ingredients,
            routines, and concerns specific to South African skin and climate.
          </p>
        </div>

        {/* Suggested Questions - Only show if chat is new */}
        {messages.length === 1 && (
          <Card className="mb-6 p-4 bg-card/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Suggested Questions</p>
            </div>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-3 rounded-lg bg-background hover:bg-muted transition-colors text-sm"
                  data-testid={`suggested-question-${index}`}
                >
                  {question}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              <strong>Pro tip:</strong> Be specific about your skin type, concerns, and
              any products you're currently using for more personalized advice.
            </p>
          </Card>
        )}

        {/* Chat Messages */}
        <Card className="mb-4 bg-card/50">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4" ref={scrollAreaRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                    data-testid={`message-${message.role}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-xs font-medium">SKYNN AI</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-xs font-medium">SKYNN AI</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Input Area */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about skincare, ingredients, or routines..."
            className="w-full min-h-[60px] max-h-[120px] p-4 pr-12 rounded-lg bg-background border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isTyping}
            data-testid="chat-input"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="absolute bottom-3 right-3 rounded-full"
            data-testid="send-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-4 p-4 bg-destructive/10 border-destructive/20">
          <p className="text-xs text-center">
            <strong>Disclaimer:</strong> This AI provides educational skincare information only,
            not medical diagnosis or prescription. For serious skin conditions or concerns,
            please consult a licensed dermatologist.
          </p>
        </Card>
      </div>
    </div>
  );
}