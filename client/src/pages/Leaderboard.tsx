import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { Trophy, Shield } from "lucide-react";

export default function Leaderboard() {
  // Mock data for MVP
  const leaders = [
    { rank: 1, name: "Arjun", xp: 1250, avatar: "A" },
    { rank: 2, name: "Priya", xp: 1100, avatar: "P" },
    { rank: 3, name: "Rahul", xp: 950, avatar: "R" },
    { rank: 4, name: "You", xp: 800, avatar: "Y" }, // Current user
    { rank: 5, name: "Sneha", xp: 750, avatar: "S" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          
          <div className="text-center mb-8">
             <div className="inline-block p-4 rounded-full bg-yellow-100 mb-4 border-4 border-yellow-200">
                <Shield className="w-12 h-12 text-yellow-500" />
             </div>
             <h2 className="text-2xl font-bold text-gray-700">Bronze League</h2>
             <p className="text-gray-400 font-medium">Top 10 advance to the next league</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
             {leaders.map((leader) => (
               <div 
                 key={leader.rank} 
                 className={`
                   flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors
                   ${leader.name === "You" ? "bg-blue-50" : ""}
                 `}
               >
                 <div className="w-8 text-center font-bold text-gray-400">
                    {leader.rank}
                 </div>
                 
                 <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                    ${leader.rank === 1 ? "bg-yellow-400" : 
                      leader.rank === 2 ? "bg-gray-400" : 
                      leader.rank === 3 ? "bg-orange-400" : "bg-[#58cc02]"}
                 `}>
                    {leader.avatar}
                 </div>
                 
                 <div className="flex-1 font-bold text-gray-700 text-lg">
                    {leader.name}
                 </div>
                 
                 <div className="font-medium text-gray-500">
                    {leader.xp} XP
                 </div>
               </div>
             ))}
          </div>

        </div>
      </main>
      <MobileNav />
    </div>
  );
}
