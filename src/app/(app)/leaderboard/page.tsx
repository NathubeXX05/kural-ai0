// import { Avatar } from "@/components/ui/avatar"; 
// Note: I don't have an Avatar component yet, I should check or create one. 
// I'll stick to basic divs for now or create a simple Avatar component later.
// Actually, let's just use a div with initials for now to avoid dependency issues.

import { Trophy, Medal, Crown } from "lucide-react";

const leaderboardData = [
    { rank: 1, name: "Sundar P.", xp: 12500, avatar: "S" },
    { rank: 2, name: "Anita R.", xp: 11200, avatar: "A" },
    { rank: 3, name: "Karthik M.", xp: 10500, avatar: "K" },
    { rank: 4, name: "You", xp: 9800, avatar: "U" },
    { rank: 5, name: "Priya S.", xp: 9200, avatar: "P" },
];

export default function LeaderboardPage() {
    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
                <p className="text-muted-foreground">See where you stand among other Tamil learners.</p>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {leaderboardData.map((user, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${user.name === 'You' ? 'bg-primary/5' : ''}`}
                    >
                        <div className="w-8 font-bold text-center text-muted-foreground">
                            {index === 0 ? <Crown className="h-6 w-6 text-yellow-500 mx-auto" /> :
                                index === 1 ? <Medal className="h-6 w-6 text-gray-400 mx-auto" /> :
                                    index === 2 ? <Medal className="h-6 w-6 text-amber-600 mx-auto" /> :
                                        `#${user.rank}`}
                        </div>

                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground border">
                            {user.avatar}
                        </div>

                        <div className="flex-1">
                            <p className={`font-semibold ${user.name === 'You' ? 'text-primary' : ''}`}>
                                {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Daily Streak: {Math.floor(Math.random() * 50)}🔥</p>
                        </div>

                        <div className="font-bold text-right">
                            {user.xp.toLocaleString()} XP
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
