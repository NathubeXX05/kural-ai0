import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, Volume2, Mic, Languages, Bell } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and app settings.</p>
            </div>

            <div className="flex flex-col gap-6">
                {/* Appearance */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Monitor className="h-4 w-4" /> Appearance
                        </h3>
                    </div>
                    <div className="p-6 grid gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Theme</p>
                                <p className="text-sm text-muted-foreground">Select your preferred interface theme.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
                                <Button variant="ghost" size="sm" className="rounded-md h-8 px-2"><Sun className="h-4 w-4 mr-2" /> Light</Button>
                                <Button variant="ghost" size="sm" className="rounded-md h-8 px-2"><Moon className="h-4 w-4 mr-2" /> Dark</Button>
                                <Button variant="secondary" size="sm" className="rounded-md h-8 px-2 shadow-sm bg-background text-foreground"><Monitor className="h-4 w-4 mr-2" /> System</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language & Learning */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Languages className="h-4 w-4" /> Learning Preferences
                        </h3>
                    </div>
                    <div className="p-6 grid gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Interface Language</p>
                                <p className="text-sm text-muted-foreground">Change the language of the UI.</p>
                            </div>
                            <select className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                <option>English</option>
                                <option>Tamil</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Daily Goal</p>
                                <p className="text-sm text-muted-foreground">Set your daily XP target.</p>
                            </div>
                            <select className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                <option>Casual (10 XP)</option>
                                <option>Regular (20 XP)</option>
                                <option>Serious (50 XP)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Audio & Notifications */}
                <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Bell className="h-4 w-4" /> Notifications & Sound
                        </h3>
                    </div>
                    <div className="p-6 grid gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Sound Effects</p>
                                <p className="text-sm text-muted-foreground">Play sounds for correct/incorrect answers.</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                                <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Daily Reminders</p>
                                <p className="text-sm text-muted-foreground">Get reminded to practice.</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
                                <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
