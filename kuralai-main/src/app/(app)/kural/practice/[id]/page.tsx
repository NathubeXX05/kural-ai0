"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Check, X, ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { completeLesson, getProgress } from "@/lib/progress";

// Mock Thirukkural Data
const kuralData: Record<string, any> = {
    "1": {
        id: 1,
        tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு",
        transliteration: "Akara mudala ezhuthellaam aadhi\nBhagavan mudhatre ulagu",
        translation: "A is the first of letters; God is first in the world.",
        explanation: "Just as the letter 'A' is the foundation of all Tamil letters, God is the foundation of the universe.",
        targetWords: ["அகர", "முதல", "எழுத்தெல்லாம", "ஆதி", "பகவன்", "முதற்றே", "உலகு"],
    },
    "2": {
        id: 2,
        tamil: "கற்க கசடறக் கற்பவை கற்றபின்\nநிற்க அதற்குத் தக",
        transliteration: "Karka kasadarak karpavai katrrapin\nNirka adharkkuth thaga",
        translation: "Learn faultlessly; after learning, live accordingly.",
        explanation: "One should learn thoroughly without errors, and then live according to what has been learned.",
        targetWords: ["கற்க", "கசடறக்", "கற்பவை", "கற்றபின்", "நிற்க", "அதற்குத்", "தக"],
    },
};

export default function KuralPracticePage() {
    const params = useParams();
    const router = useRouter();
    const kuralId = typeof params.id === 'string' ? params.id : '1';
    const kural = kuralData[kuralId] || kuralData["1"];

    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [correctWords, setCorrectWords] = useState<string[]>([]);
    const [attempts, setAttempts] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'ta-IN'; // Tamil language

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript.toLowerCase();
                    setRecognizedText(transcript);
                    checkPronunciation(transcript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [currentWordIndex]);

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            setRecognizedText("");
            recognitionRef.current.start();
        } else {
            // Fallback: simulate recognition for demo
            simulateRecognition();
        }
    };

    const simulateRecognition = () => {
        setIsListening(true);
        setTimeout(() => {
            const currentWord = kural.targetWords[currentWordIndex];
            // Simulate correct pronunciation
            setRecognizedText(currentWord);
            checkPronunciation(currentWord);
            setIsListening(false);
        }, 2000);
    };

    const checkPronunciation = (transcript: string) => {
        const currentWord = kural.targetWords[currentWordIndex];
        const isCorrect = transcript.includes(currentWord) ||
            currentWord.toLowerCase().includes(transcript) ||
            similarity(transcript, currentWord) > 0.6;

        setAttempts(prev => prev + 1);

        if (isCorrect) {
            setCorrectWords([...correctWords, currentWord]);

            if (currentWordIndex < kural.targetWords.length - 1) {
                setTimeout(() => {
                    setCurrentWordIndex(prev => prev + 1);
                    setRecognizedText("");
                    setShowHint(false);
                }, 1500);
            } else {
                // All words completed
                setTimeout(() => {
                    const xpEarned = 30;
                    completeLesson(`kural-${kuralId}`);
                    setCompleted(true);
                }, 1500);
            }
        } else {
            // Show hint after 2 failed attempts
            if (attempts >= 1) {
                setShowHint(true);
            }
        }
    };

    // Simple similarity function
    const similarity = (s1: string, s2: string) => {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / longerLength;
    };

    const editDistance = (s1: string, s2: string) => {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        const costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    };

    const playAudio = () => {
        // Text-to-speech for Tamil
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(kural.targetWords[currentWordIndex]);
            utterance.lang = 'ta-IN';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center max-w-md mx-auto">
                <div className="h-32 w-32 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center text-6xl shadow-lg animate-bounce">
                    🎯
                </div>
                <h1 className="text-3xl font-bold text-primary">Perfect Pronunciation!</h1>
                <p className="text-xl text-muted-foreground">
                    You earned <span className="text-yellow-500 font-bold">30 XP</span>
                </p>
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                    <div className="flex flex-col items-center p-4 rounded-xl bg-card border shadow-sm">
                        <span className="text-sm uppercase font-bold text-muted-foreground">Words</span>
                        <span className="text-2xl font-bold text-green-500">{kural.targetWords.length}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-xl bg-card border shadow-sm">
                        <span className="text-sm uppercase font-bold text-muted-foreground">Attempts</span>
                        <span className="text-2xl font-bold text-blue-500">{attempts}</span>
                    </div>
                </div>
                <div className="flex w-full gap-4 mt-8">
                    <Link href="/kural" className="w-full">
                        <Button size="lg" className="w-full text-lg">Continue</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentWord = kural.targetWords[currentWordIndex];
    const progress = (correctWords.length / kural.targetWords.length) * 100;
    const isCorrect = correctWords.includes(currentWord);

    return (
        <div className="flex flex-col min-h-[calc(100vh-8rem)] max-w-3xl mx-auto p-4">
            <div className="mb-6">
                <Link href="/kural">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Thirukkural
                    </Button>
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Thirukkural {kural.id} - Pronunciation Practice</h1>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    Word {currentWordIndex + 1} of {kural.targetWords.length}
                </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="text-center space-y-4 p-8 rounded-2xl bg-card border shadow-sm w-full">
                    <h2 className="text-sm uppercase font-bold text-muted-foreground">Pronounce this word:</h2>
                    <p className="text-5xl font-bold text-primary">{currentWord}</p>
                    <p className="text-xl text-muted-foreground">{kural.transliteration.split('\n')[0].split(' ')[currentWordIndex]}</p>
                </div>

                <div className="flex gap-4">
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={playAudio}
                        className="h-16 w-16 rounded-full"
                    >
                        <Volume2 className="h-6 w-6" />
                    </Button>

                    <Button
                        size="lg"
                        onClick={startListening}
                        disabled={isListening}
                        className={cn(
                            "h-20 w-20 rounded-full shadow-lg transition-all",
                            isListening && "animate-pulse bg-red-500 hover:bg-red-600"
                        )}
                    >
                        <Mic className="h-8 w-8" />
                    </Button>
                </div>

                {isListening && (
                    <div className="text-center animate-pulse">
                        <p className="text-lg font-medium text-primary">Listening...</p>
                        <div className="flex gap-1 justify-center mt-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-2 bg-primary rounded-full animate-bounce"
                                    style={{ height: Math.random() * 32 + 16, animationDelay: `${i * 0.1}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}

                {recognizedText && (
                    <div className={cn(
                        "p-4 rounded-xl border-2 w-full max-w-md text-center",
                        isCorrect ? "bg-green-50 border-green-500 dark:bg-green-900/20" : "bg-red-50 border-red-500 dark:bg-red-900/20"
                    )}>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {isCorrect ? (
                                <Check className="h-6 w-6 text-green-600" />
                            ) : (
                                <X className="h-6 w-6 text-red-600" />
                            )}
                            <span className={cn("font-bold", isCorrect ? "text-green-600" : "text-red-600")}>
                                {isCorrect ? "Perfect!" : "Try again"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">You said: "{recognizedText}"</p>
                    </div>
                )}

                {showHint && !isCorrect && (
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 w-full max-w-md">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            💡 Hint: Listen carefully and try to match the pronunciation exactly
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-muted/50 border">
                <h3 className="font-bold mb-2">Full Kural:</h3>
                <p className="text-lg leading-relaxed">{kural.tamil}</p>
                <p className="text-sm text-muted-foreground mt-2 italic">{kural.translation}</p>
            </div>
        </div>
    );
}
