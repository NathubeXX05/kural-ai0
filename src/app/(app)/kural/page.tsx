"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, MicOff, RefreshCw, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- TYPESCRIPT FIX POUR LE MICRO ---
// Cela évite les lignes rouges car TypeScript ne connaît pas webkitSpeechRecognition par défaut
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// Mock Data (Simule le Kural récupéré via l'ID)
const kuralData = {
    number: 1,
    tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு.",
    transliteration: "Agara mudhala ezhutthellaam aadhi\nbagavan mudhatre ulagu.",
    explanation: "Just as the alphabet begins with the letter 'A', so does the world begin with God."
};

export default function PracticePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    
    // Référence pour garder l'instance du micro en mémoire
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Nettoyage quand on quitte la page
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startListening = () => {
        setFeedback(null);
        setTranscript("");

        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;

        if (!SpeechRecognitionAPI) {
            alert("Désolé, votre navigateur ne supporte pas la reconnaissance vocale.");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        
        // --- CONFIGURATION CRITIQUE POUR MOBILE ---
        recognition.lang = 'ta-IN'; // Tamoul
        recognition.continuous = false; // IMPORTANT: Mettre false sur mobile évite les coupures immédiates
        recognition.interimResults = true; // Permet de voir le texte s'écrire en direct

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
        };

        recognition.onerror = (event: any) => {
            console.error("Erreur micro:", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert("Veuillez autoriser l'accès au micro dans les paramètres de votre navigateur.");
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            // Ici, tu pourrais appeler une fonction pour vérifier la prononciation automatiquement
            validatePronunciation(); 
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const validatePronunciation = () => {
        // Simulation simple de validation
        // Dans une vraie app, tu comparerais 'transcript' avec 'kuralData.tamil'
        setFeedback("Traitement de votre prononciation terminé.");
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto p-4">
            {/* Header avec retour */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">Practice Mode</h1>
            </div>

            {/* Carte du Kural */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-6 text-center">
                <div className="space-y-4">
                    <p className="text-2xl font-bold text-primary whitespace-pre-line leading-relaxed">
                        {kuralData.tamil}
                    </p>
                    <p className="text-lg text-muted-foreground italic">
                        {kuralData.transliteration}
                    </p>
                </div>

                {/* Zone de feedback visuel */}
                <div className={cn(
                    "min-h-[100px] rounded-lg border-2 border-dashed flex items-center justify-center p-4 transition-colors",
                    isListening ? "border-primary bg-primary/5" : "border-muted"
                )}>
                    {transcript ? (
                        <p className="text-lg font-medium">{transcript}</p>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            {isListening ? "Listening..." : "Tap the microphone to start speaking"}
                        </p>
                    )}
                </div>

                {feedback && (
                    <div className="p-3 bg-secondary rounded-lg text-sm font-medium">
                        {feedback}
                    </div>
                )}

                {/* Contrôles */}
                <div className="flex justify-center gap-4 pt-4">
                    <Button 
                        size="lg"
                        variant={isListening ? "destructive" : "default"}
                        className={cn("h-16 w-16 rounded-full shadow-lg transition-all", isListening && "scale-110")}
                        onClick={isListening ? stopListening : startListening}
                    >
                        {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                    </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                    Conseil : Parlez clairement et proche du micro.
                </p>
            </div>
        </div>
    );
}
