"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const onboardingSteps = [
    {
        id: 1,
        title: "Welcome to KuralAI! 🎉",
        description: "Your personal AI-powered Tamil learning companion.",
        image: "🌟",
    },
    {
        id: 2,
        title: "What's your goal?",
        description: "Choose what you'd like to achieve",
        options: [
            { id: "conversation", label: "Have conversations in Tamil", icon: "💬" },
            { id: "read", label: "Read Tamil texts & Thirukkural", icon: "📖" },
            { id: "both", label: "Both speaking and reading", icon: "🎯" },
        ],
    },
    {
        id: 3,
        title: "How much time can you dedicate?",
        description: "Set your daily goal",
        options: [
            { id: "5min", label: "5 min/day", subtitle: "Casual", icon: "☕" },
            { id: "10min", label: "10 min/day", subtitle: "Regular", icon: "📚" },
            { id: "20min", label: "20 min/day", subtitle: "Serious", icon: "🔥" },
        ],
    },
    {
        id: 4,
        title: "You're all set! 🚀",
        description: "Let's start your Tamil learning journey",
        image: "🎊",
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<Record<number, string>>({});

    const step = onboardingSteps[currentStep];
    const isLastStep = currentStep === onboardingSteps.length - 1;
    const hasOptions = "options" in step;

    const handleNext = () => {
        if (isLastStep) {
            // Save preferences to localStorage
            localStorage.setItem("kural_onboarded", "true");
            localStorage.setItem("kural_preferences", JSON.stringify(selections));
            router.push("/learn");
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleSelect = (optionId: string) => {
        setSelections({ ...selections, [step.id]: optionId });
    };

    const canProceed = !hasOptions || selections[step.id];

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-12 flex gap-2">
                    {onboardingSteps.map((s, idx) => (
                        <div
                            key={s.id}
                            className={cn(
                                "h-2 flex-1 rounded-full transition-all",
                                idx <= currentStep ? "bg-primary" : "bg-secondary"
                            )}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="text-center animate-fade-in-up">
                    {"image" in step && (
                        <div className="mb-8 text-8xl">{step.image}</div>
                    )}

                    <h1 className="mb-4 text-4xl font-bold">{step.title}</h1>
                    <p className="mb-12 text-xl text-muted-foreground">
                        {step.description}
                    </p>

                    {/* Options */}
                    {hasOptions && step.options && (
                        <div className="mb-12 grid gap-4 md:grid-cols-3">
                            {step.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelect(option.id)}
                                    className={cn(
                                        "relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all hover:scale-105",
                                        selections[step.id] === option.id
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    {selections[step.id] === option.id && (
                                        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                    <div className="text-4xl">{option.icon}</div>
                                    <div className="text-center">
                                        <div className="font-bold">{option.label}</div>
                                        {'subtitle' in option && option.subtitle && (
                                            <div className="text-sm text-muted-foreground">
                                                {option.subtitle}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-center gap-4">
                        {currentStep > 0 && !isLastStep && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setCurrentStep((prev) => prev - 1)}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={!canProceed}
                            className="min-w-[200px]"
                        >
                            {isLastStep ? "Start Learning" : "Continue"}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
