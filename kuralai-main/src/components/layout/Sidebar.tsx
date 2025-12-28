"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, BookOpen, User, Trophy, Settings, Gem, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const sidebarItems = [
    { icon: Home, label: "Learn", href: "/learn" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: BookOpen, label: "Thirukkural", href: "/kural" },
    { icon: BookOpen, label: "Vocabulary", href: "/vocabulary" },
    { icon: BookOpen, label: "Grammar", href: "/grammar" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    { icon: Gem, label: "Shop", href: "/shop" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const getUserInitial = () => {
        if (!user) return "?";
        if (user.user_metadata?.full_name) {
            return user.user_metadata.full_name.charAt(0).toUpperCase();
        }
        return user.email?.charAt(0).toUpperCase() || "?";
    };

    const getUserName = () => {
        if (!user) return "Guest";
        return user.user_metadata?.full_name || user.email?.split('@')[0] || "User";
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-background hidden md:flex">
            <div className="flex h-16 items-center justify-between px-6 border-b">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    KuralAI
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="h-9 w-9"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t space-y-2">
                {!loading && user && (
                    <>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {getUserInitial()}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium truncate">{getUserName()}</span>
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </>
                )}
            </div>
        </aside>
    );
}
