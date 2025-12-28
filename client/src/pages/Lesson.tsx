import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useLesson, useUpdateProgress } from "@/hooks/use-lessons";
import { Button3D } from "@/components/ui/Button3D";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function Lesson() {
  const [, params] = useRoute("/lesson/:id");
  const [, setLocation] = useLocation();
  const lessonId = parseInt(params?.id || "0");
  
  const { data: lesson, isLoading } = useLesson(lessonId);
  const { mutate: updateProgress } = useUpdateProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [hearts, setHearts] = useState(5);

  // Play sound effect (mock)
  const playSound = (type: "correct" | "wrong") => {
    // In a real app, use Audio API
    console.log(`Playing ${type} sound`);
  };

  const currentExercise = lesson?.exercises[currentIndex];
  const progressPercentage = lesson ? ((currentIndex) / lesson.exercises.length) * 100 : 0;

  const handleCheck = () => {
    if (!currentExercise || !selectedOption) return;

    if (selectedOption === currentExercise.answer) {
      setStatus("correct");
      playSound("correct");
    } else {
      setStatus("incorrect");
      playSound("wrong");
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const handleContinue = () => {
    if (!lesson) return;
    
    if (currentIndex < lesson.exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setStatus("idle");
    } else {
      // Lesson Complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      updateProgress({ 
        lessonId, 
        completed: true, 
        score: hearts * 10 
      }, {
        onSuccess: () => {
          setTimeout(() => setLocation("/learn"), 2000);
        }
      });
    }
  };

  if (isLoading || !lesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Completed State UI
  if (currentIndex >= lesson.exercises.length && status === "correct") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#58cc02] text-white">
        <h1 className="text-4xl font-extrabold mb-4 animate-bounce">Lesson Complete!</h1>
        <p className="text-xl font-bold opacity-90 mb-8">+ {hearts * 10} XP</p>
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8">
           <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <p className="animate-pulse">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={() => setLocation("/learn")} className="text-gray-400 hover:bg-gray-100 p-2 rounded-full">
          <X className="w-6 h-6" />
        </button>
        
        {/* Progress Bar */}
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#58cc02] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-red-500 font-bold text-xl">❤</span>
          <span className="text-red-500 font-bold text-lg">{hearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 w-full max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-12 text-center">
              {currentExercise?.question}
            </h2>

            {currentExercise?.type === "mcq" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {(currentExercise.options as string[]).map((option) => (
                  <div
                    key={option}
                    onClick={() => status === "idle" && setSelectedOption(option)}
                    className={`
                      cursor-pointer p-4 rounded-2xl border-2 border-b-4 text-center font-bold text-lg transition-all
                      ${selectedOption === option 
                        ? 'border-[#1cb0f6] bg-blue-50 text-[#1cb0f6]' 
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }
                      ${status !== "idle" && "pointer-events-none opacity-80"}
                    `}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
            
            {/* If type is 'assist', you might render a simpler text input or simpler selection UI here */}
            {currentExercise?.type === "assist" && (
               <div className="flex flex-col gap-4">
                  <div className="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50 text-center">
                     <p className="text-gray-500 font-medium">Translate this sentence</p>
                  </div>
                  {/* For MVP, treating assist like MCQ if options exist, otherwise text input */}
                  {/* Assuming schema has options for assist too for simplicity in this generated code */}
                   <div className="grid grid-cols-1 gap-2">
                      {(currentExercise.options as string[] || ["Option 1", "Option 2"]).map((option) => (
                        <div
                            key={option}
                            onClick={() => status === "idle" && setSelectedOption(option)}
                            className={`
                              cursor-pointer p-4 rounded-xl border-2 border-b-4 text-center font-bold
                              ${selectedOption === option 
                                ? 'border-[#1cb0f6] bg-blue-50 text-[#1cb0f6]' 
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                              }
                            `}
                        >
                            {option}
                        </div>
                      ))}
                   </div>
               </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Area */}
      <div className={`
        fixed bottom-0 left-0 right-0 p-4 md:p-8 border-t-2 
        ${status === "correct" ? "bg-[#d7ffb8] border-[#b8f28b]" : 
          status === "incorrect" ? "bg-[#ffdfe0] border-[#ffc1c1]" : "bg-white border-gray-200"}
      `}>
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          
          {status === "idle" && (
            <div className="hidden md:block" /> /* Spacer */
          )}

          {status === "correct" && (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom fade-in duration-300">
              <div className="bg-white p-2 rounded-full">
                <CheckCircle className="w-8 h-8 text-[#58cc02]" />
              </div>
              <div>
                <h3 className="text-[#58cc02] font-extrabold text-xl">Nicely done!</h3>
              </div>
            </div>
          )}

          {status === "incorrect" && (
            <div className="flex items-center gap-4 animate-in slide-in-from-bottom fade-in duration-300">
              <div className="bg-white p-2 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-red-500 font-extrabold text-xl">Correct solution:</h3>
                <p className="text-red-600 font-medium">{currentExercise?.answer}</p>
              </div>
            </div>
          )}

          <div className="w-full md:w-auto mt-4 md:mt-0">
             {status === "idle" ? (
                <Button3D 
                  fullWidth 
                  size="lg" 
                  onClick={handleCheck} 
                  disabled={!selectedOption}
                  className="md:w-40"
                >
                  Check
                </Button3D>
             ) : (
                <Button3D 
                  fullWidth 
                  size="lg" 
                  variant={status === "correct" ? "primary" : "danger"}
                  onClick={handleContinue}
                  className="md:w-40"
                >
                  Continue
                </Button3D>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
