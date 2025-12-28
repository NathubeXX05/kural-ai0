import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { Zap, Target, Book } from "lucide-react";

export default function Quests() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          
          <h2 className="text-2xl font-bold text-gray-700 mb-8">Daily Quests</h2>

          <div className="space-y-4">
             {/* Quest 1 */}
             <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                   <Zap className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-gray-700 text-lg">Earn 50 XP</h3>
                   <div className="mt-3 h-4 bg-gray-200 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-orange-500 w-3/4" />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                         35 / 50
                      </div>
                   </div>
                </div>
                <div className="shrink-0">
                   <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm">
                      Claim
                   </div>
                </div>
             </div>

             {/* Quest 2 */}
             <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 flex items-center gap-6 opacity-75">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                   <Target className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-gray-700 text-lg">Score 90% in a lesson</h3>
                   <div className="mt-3 h-4 bg-gray-200 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-blue-500 w-0" />
                   </div>
                </div>
             </div>
             
             {/* Quest 3 */}
             <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 flex items-center gap-6 opacity-75">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                   <Book className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex-1">
                   <h3 className="font-bold text-gray-700 text-lg">Read a story</h3>
                   <div className="mt-3 h-4 bg-gray-200 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full bg-green-500 w-0" />
                   </div>
                </div>
             </div>
          </div>

        </div>
      </main>
      <MobileNav />
    </div>
  );
}
