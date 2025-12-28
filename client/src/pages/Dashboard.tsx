import { useCourses, useUnits } from "@/hooks/use-courses";
import { Button3D } from "@/components/ui/Button3D";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { Star, Lock, Check } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  
  // For MVP, we assume the first course (Tamil) is active. 
  // In a real app, user would select active course.
  const activeCourseId = courses?.[0]?.id;
  const { data: units, isLoading: unitsLoading } = useUnits(activeCourseId ?? 0);

  if (coursesLoading || (activeCourseId && unitsLoading)) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-[#58cc02] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white md:bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-gray-700">Learning Path</h2>
            <div className="flex items-center gap-2 bg-yellow-400/20 px-3 py-1.5 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600 fill-current" />
              <span className="font-extrabold text-yellow-700">0 XP</span>
            </div>
          </div>

          {/* Units List */}
          <div className="space-y-6">
            {units?.map((unit, unitIndex) => (
              <div 
                key={unit.id} 
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
              >
                {/* Unit Header */}
                <div 
                  className={`p-4 border-b-2 border-gray-100 flex justify-between items-center
                    ${unitIndex === 0 ? 'bg-[#58cc02] text-white' : 'bg-gray-50 text-gray-600'}
                  `}
                >
                  <div>
                    <h3 className="font-extrabold text-lg uppercase tracking-wide">
                      Unit {unit.order}: {unit.title}
                    </h3>
                    <p className={`text-sm font-medium opacity-90 ${unitIndex === 0 ? 'text-green-100' : 'text-gray-500'}`}>
                      {unit.description}
                    </p>
                  </div>
                </div>

                {/* Lessons Path */}
                <div className="p-8 flex flex-col items-center gap-6 relative">
                  {unit.lessons.map((lesson, idx) => {
                    const isCompleted = lesson.completed;
                    // Simplistic logic: First incomplete lesson is "current". 
                    // Previous ones are completed. Future ones are locked.
                    // This logic would need to be more robust in a real app checking ALL previous lessons.
                    const isCurrent = !isCompleted && (idx === 0 || unit.lessons[idx-1].completed);
                    const isLocked = !isCompleted && !isCurrent;
                    
                    // Zig-zag offset for visual interest
                    const offset = idx % 2 === 0 ? 0 : 40; 
                    
                    return (
                      <Link key={lesson.id} href={isLocked ? "#" : `/lesson/${lesson.id}`}>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`relative z-10`}
                          style={{ marginLeft: idx % 2 !== 0 ? '4rem' : '-4rem' }}
                        >
                          <div className="flex flex-col items-center gap-2 group cursor-pointer">
                            {/* Circle Button */}
                            <div 
                              className={`
                                w-20 h-20 rounded-full flex items-center justify-center border-b-8 transition-all
                                ${isCompleted 
                                  ? 'bg-[#ffc800] border-[#d9aa00]' 
                                  : isCurrent 
                                    ? 'bg-[#58cc02] border-[#46a302] hover:bg-[#61e002]' 
                                    : 'bg-gray-200 border-gray-300 pointer-events-none'
                                }
                                ${!isLocked && 'active:border-b-0 active:translate-y-2'}
                              `}
                            >
                              {isCompleted ? (
                                <Check className="w-10 h-10 text-white stroke-[4]" />
                              ) : isLocked ? (
                                <Lock className="w-8 h-8 text-gray-400" />
                              ) : (
                                <Star className="w-10 h-10 text-white fill-current" />
                              )}
                            </div>
                            
                            {/* Floating Tooltip/Label (only for current) */}
                            {isCurrent && (
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl border-2 border-gray-200 shadow-sm whitespace-nowrap animate-bounce">
                                <span className="font-bold text-gray-600 text-sm">START</span>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-gray-200 rotate-45" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
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
