import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">KuralAI</span>
                </div>
                <nav className="hidden gap-6 md:flex">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                        How it works
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                        Pricing
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden text-sm font-medium hover:text-primary sm:block">
                        Log in
                    </Link>
                    <Link href="/learn">
                        <Button>Get Started</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
