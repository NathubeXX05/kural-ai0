"use client";

import Link from "next/link";
import { Menu, Moon, Sun, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileHeader() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                KuralAI
            </Link>
            <div className="ml-auto flex items-center gap-2">
                {user && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
}
