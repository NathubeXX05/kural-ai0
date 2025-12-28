'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [progress, setProgress] = useState<any[]>([]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/auth');
            return;
        }

        setUser(user);

        // Fetch user progress
        const { data: progressData } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id);

        setProgress(progressData || []);
        setLoading(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const completedLessons = progress.filter(p => p.completed).length;
    const totalXP = progress.reduce((sum, p) => sum + p.score, 0);
    const joinedDate = new Date(user?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 p-6 rounded-2xl border bg-card shadow-sm">
                    <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold">
                            {user?.user_metadata?.full_name || 'User'}
                        </h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground">
                                Free Plan
                            </span>
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                                Joined {joinedDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-6 rounded-xl border bg-card text-center gap-2 flex flex-col">
                        <span className="text-4xl font-bold text-primary">{completedLessons}</span>
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Lessons Completed</span>
                    </div>
                    <div className="p-6 rounded-xl border bg-card text-center gap-2 flex flex-col">
                        <span className="text-4xl font-bold text-primary">{totalXP}</span>
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total XP</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Account Settings</h3>
                    <div className="rounded-xl border bg-card overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b hover:bg-secondary/20 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Settings className="h-5 w-5 text-muted-foreground" />
                                <span>General Preferences</span>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-between p-4 hover:bg-secondary/20 cursor-pointer text-destructive"
                        >
                            <div className="flex items-center gap-3">
                                <LogOut className="h-5 w-5" />
                                <span>Sign Out</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
