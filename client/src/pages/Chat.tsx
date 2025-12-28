import { useState, useRef, useEffect } from "react";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { Button3D } from "@/components/ui/Button3D";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

// Types for chat
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// Using the provided integration's streaming endpoint logic
// Note: In a real app, this would use the `useChatStream` hook or similar.
// Since the integration code provided earlier had a specific route structure,
// we'll implement a simple fetch with readable stream here.

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "assistant", content: "Vanakkam! I'm your AI Tamil tutor. Practice a conversation with me or ask me grammar questions!" }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Create a conversation first (mock ID for MVP or fetch actual)
  const conversationId = 1; 

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Placeholder for new assistant message
    const botMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: botMsgId, role: "assistant", content: "" }]);

    try {
      // NOTE: This assumes the integration provided earlier is active at this endpoint
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg.content }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (!dataStr || dataStr === "[DONE]") continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.done) break;
              if (data.content) {
                botResponse += data.content;
                setMessages(prev => 
                  prev.map(m => m.id === botMsgId ? { ...m, content: botResponse } : m)
                );
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: "error", role: "assistant", content: "Sorry, I had trouble connecting. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#1cb0f6] p-2 rounded-full">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-700">Tamil AI Tutor</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24" ref={scrollRef}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${msg.role === "user" ? "bg-gray-200" : "bg-[#1cb0f6]"}
              `}>
                {msg.role === "user" ? (
                   <UserIcon className="w-6 h-6 text-gray-500" />
                ) : (
                   <Bot className="w-6 h-6 text-white" />
                )}
              </div>
              
              <div className={`
                max-w-[80%] p-4 rounded-2xl text-base font-medium leading-relaxed
                ${msg.role === "user" 
                  ? "bg-gray-100 text-gray-800 rounded-tr-none" 
                  : "bg-white border-2 border-gray-100 text-gray-700 rounded-tl-none shadow-sm"
                }
              `}>
                {msg.content || (isStreaming && msg.id === messages[messages.length-1].id ? <Loader2 className="w-4 h-4 animate-spin" /> : "")}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message in English or Tamil..."
              disabled={isStreaming}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#1cb0f6] bg-gray-50 focus:bg-white transition-colors"
            />
            <Button3D 
              variant="secondary" 
              size="icon" 
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
            >
              <Send className="w-5 h-5" />
            </Button3D>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
