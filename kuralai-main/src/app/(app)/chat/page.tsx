"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Mic, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
};

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Vanakkam! I am your Tamil tutor. How can I help you today? You can write in English or Tamil (Tanglish).",
        },
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add User Message
        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");

        try {
            // Call local backend (mocked for now, but structure is there)
            // Ensure you run 'npm run dev' or 'wrangler dev' in kural-ai root
            // For development, we assume backend is at http://localhost:8787
            const res = await fetch("http://localhost:8787/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            });

            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.response || "Error connecting to AI."
            };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (err) {
            console.error("Failed to fetch AI response", err);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running."
            };
            setMessages((prev) => [...prev, aiMsg]);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center gap-4 border-b p-4 bg-muted/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Bot className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="font-semibold">Kural AI Tutor</h2>
                    <p className="text-xs text-muted-foreground">Online • 24/7</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                    <div key={m.id} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                            m.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-muted text-foreground rounded-bl-none"
                        )}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-background">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Mic className="h-5 w-5" />
                    </Button>
                    <input
                        className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" className="rounded-full" onClick={handleSend} disabled={!input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
