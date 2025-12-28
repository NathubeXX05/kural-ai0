import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book } from "lucide-react";

export default function GrammarPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Tamil Grammar Reference</h1>
                <p className="text-muted-foreground">Quick guides to understanding Tamil structure.</p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Book className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold">Basics</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>SVO Structure (Subject-Object-Verb)</AccordionTrigger>
                        <AccordionContent>
                            Tamil typically follows an SOV word order, unlike English (SVO). <br />
                            Example: <i>Naan pazham saapitten</i> (I fruit ate) = I ate a fruit.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Politeness Markers</AccordionTrigger>
                        <AccordionContent>
                            Respect is key in Tamil. <br />
                            - <b>Ni</b>: You (informal) <br />
                            - <b>Neengal</b>: You (formal/plural) <br />
                            Always use formal versions with elders and strangers.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Verb Conjugation (Tenses)</AccordionTrigger>
                        <AccordionContent>
                            Verbs change based on person, number, and gender. <br />
                            Example "to come" (Vaa): <br />
                            - Past: Vandhen (I came) <br />
                            - Present: Varukiren (I am coming) <br />
                            - Future: Varuven (I will come)
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
