"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Thirukkurals
const kuralOfTheDay = {
    number: 1,
    tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு.",
    transliteration: "Agara mudhala ezhutthellaam aadhi\nbagavan mudhatre ulagu.",
    translation: "A is the first of all letters, even so is God Primordial the first of all the world.",
    explanation: "Just as the alphabet begins with the letter 'A', so does the world begin with God."
};

const chapters = [
    { id: 1, title: "Praise of God", tamil: "கடவுள் வர்ணனை", count: 10 },
    { id: 2, title: "The Excellence of Rain", tamil: "வான்சிறப்பு", count: 10 },
    { id: 3, title: "The Greatness of Ascetics", tamil: "நீத்தார் பெருமை", count: 10 },
    // ... more chapters
];

export default function KuralPage() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Thirukkural Mastery</h1>
                <p className="text-muted-foreground">Learn the wisdom of the ages, one couplet at a time.</p>
            </div>

            {/* Kural of the Day Card */}
            <div className="rounded-2xl border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Kural of the Day</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Kural {kuralOfTheDay.number}</h3>
                        <p className="text-2xl font-bold leading-relaxed text-primary whitespace-pre-line">
                            {kuralOfTheDay.tamil}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Transliteration</h4>
                        <p className="text-lg italic whitespace-pre-line">
                            {kuralOfTheDay.transliteration}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Translation</h4>
                        <p className="text-base">
                            {kuralOfTheDay.translation}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground">Explanation</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {kuralOfTheDay.explanation}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <a href="/kural/practice/1" className="flex-1">
                            <Button className="w-full gap-2" size="lg">
                                <Play className="h-5 w-5" />
                                Practice Pronunciation
                            </Button>
                        </a>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            <Play className={cn("h-5 w-5", isPlaying && "fill-primary text-primary")} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Explore Chapters Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Explore Chapters</h2>
                    <div className="relative w-64 max-w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search kurals..."
                            className="w-full rounded-lg bg-background border px-9 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {chapters.map((chapter) => (
                        <div key={chapter.id} className="flex items-center justify-between rounded-xl border bg-card p-4 hover:bg-secondary/50 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex flex-col">
                                <span className="font-bold text-lg group-hover:text-primary transition-colors">{chapter.tamil}</span>
                                <span className="text-sm text-muted-foreground">{chapter.title}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                    ))}
                    <div className="flex items-center justify-center rounded-xl border border-dashed p-4 text-muted-foreground hover:bg-muted/50 cursor-pointer">
                        View All 133 Chapters
                    </div>
                </div>
            </div>
        </div>
    );
}
