import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { User, Calendar, Flame, Trophy } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Info Card */}
            <div className="w-full md:w-80 space-y-6">
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 flex flex-col items-center text-center">
                 <div className="w-32 h-32 bg-[#58cc02] rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4 border-4 border-white shadow-lg">
                    {user.firstName?.[0] || user.email?.[0] || "U"}
                 </div>
                 <h2 className="text-2xl font-bold text-gray-700">{user.firstName} {user.lastName}</h2>
                 <p className="text-gray-400 font-medium">{user.username || user.email}</p>
                 <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm font-bold uppercase">
                    <Calendar className="w-4 h-4" />
                    Joined {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Recently'}
                 </div>
              </div>

              {/* Stats Card */}
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200">
                <h3 className="text-lg font-bold text-gray-700 mb-4">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-xl border-2 border-gray-100">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="font-bold text-gray-700">0</span>
                    </div>
                    <span className="text-xs text-gray-400 font-bold uppercase">Day Streak</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-xl border-2 border-gray-100">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-gray-700">Bronze</span>
                    </div>
                    <span className="text-xs text-gray-400 font-bold uppercase">League</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full space-y-8">
              <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 min-h-[400px]">
                <h3 className="text-xl font-bold text-gray-700 mb-6 border-b-2 border-gray-100 pb-4">
                   Achievements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Placeholder achievements */}
                   {[1,2,3].map(i => (
                     <div key={i} className="flex gap-4 items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                           <Trophy className={`w-8 h-8 ${i === 1 ? 'text-yellow-500' : 'text-gray-300'}`} />
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-700">Wildfire</h4>
                           <p className="text-sm text-gray-400 font-medium">Reach a 3 day streak</p>
                           {/* Progress bar */}
                           <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400 w-1/3" />
                           </div>
                        </div>
                     </div>
                   ))}
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
