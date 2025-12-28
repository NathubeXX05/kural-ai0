"use client";

import { useState } from "react";
import { Search, Volume2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const vocabularyData = [
    { id: 1, word: "Vanakkam", translation: "Hello / Welcome", type: "Greeting", learned: true },
    { id: 2, word: "Nandri", translation: "Thank you", type: "Common", learned: true },
    { id: 3, word: "Kaalai Vanakkam", translation: "Good Morning", type: "Greeting", learned: true },
    { id: 4, word: "Eppadi irukkinga?", translation: "How are you?", type: "Question", learned: false },
    { id: 5, word: "Sappattingala?", translation: "Have you eaten?", type: "Question", learned: false },
    { id: 6, word: "Amma", translation: "Mother", type: "Noun", learned: true },
    { id: 7, word: "Appa", translation: "Father", type: "Noun", learned: true },
    { id: 8, word: "Thanni", translation: "Water", type: "Noun", learned: false },
];

export default function VocabularyPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredVocab = vocabularyData.filter(
        (item) =>
            item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.translation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Vocabulary</h1>
                    <p className="text-muted-foreground">Your personal Tamil dictionary.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search words..."
                        className="w-full rounded-lg bg-background border px-9 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVocab.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border px-2 py-0.5 rounded-full bg-secondary">
                                {item.type}
                            </span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground hover:text-primary">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-2">
                            <h3 className="text-2xl font-bold text-primary">{item.word}</h3>
                            <p className="text-lg text-foreground/80 font-medium">{item.translation}</p>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <Volume2 className="h-4 w-4" /> Listen
                            </Button>
                        </div>

                        {item.learned && (
                            <div className="absolute top-4 right-12">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredVocab.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No words found matching "{searchTerm}".
                </div>
            )}
        </div>
    );
}
