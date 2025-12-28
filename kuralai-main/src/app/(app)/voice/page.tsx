"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, User, MoreVertical, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function VoicePage() {
    const [status, setStatus] = useState<"connecting" | "connected" | "speaking" | "listening">("connecting");
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        // Simulate connection flow
        const timer = setTimeout(() => {
            setStatus("connected");
        }, 2000);

        // Simulate call duration
        const interval = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-between py-12 max-w-md mx-auto">

            {/* Header Info */}
            <div className="flex flex-col items-center gap-2">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                    <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Kural AI Tutor</h2>
                <p className="text-secondary-foreground font-medium">
                    {status === "connecting" && "Connecting..."}
                    {status === "connected" && "Connected"}
                    {status === "speaking" && "Speaking..."}
                    {status === "listening" && "Listening..."}
                </p>
                <p className="text-sm text-muted-foreground">{formatTime(duration)}</p>
            </div>

            {/* Visualizer / Waveform (Mock) */}
            <div className="flex items-center gap-1 h-24 my-10">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-3 bg-primary rounded-full transition-all duration-300",
                            status === "connecting" ? "h-4" : "animate-bounce"
                        )}
                        style={{
                            height: status === "connecting" ? 16 : Math.random() * 64 + 16,
                            animationDelay: `${i * 0.1}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <Button variant="secondary" size="icon" className="h-14 w-14 rounded-full">
                    <Volume2 className="h-6 w-6" />
                </Button>

                <Button variant="default" size="icon" className="h-16 w-16 rounded-full shadow-lg hover:scale-105 transition-transform">
                    <Mic className="h-8 w-8" />
                </Button>

                <Link href="/chat">
                    <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full hover:bg-red-600">
                        <PhoneOff className="h-6 w-6" />
                    </Button>
                </Link>
            </div>

            {/* Transcript Area (Optional) */}
            <div className="w-full mt-8 p-4 bg-muted/30 rounded-xl text-center">
                <p className="text-sm text-muted-foreground">"Vanakkam! How are you doing today?"</p>
            </div>
        </div>
    );
}
