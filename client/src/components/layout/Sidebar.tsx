import { Link, useLocation } from "wouter";
import { Home, Trophy, BookOpen, User, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: "/learn", icon: Home, label: "Learn" },
    { href: "/chat", icon: MessageSquare, label: "AI Tutor" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { href: "/quests", icon: BookOpen, label: "Quests" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 border-r-2 border-gray-200 h-screen sticky top-0 bg-white p-4">
      <div className="px-4 mb-8">
        <h1 className="text-3xl font-extrabold text-[#58cc02] tracking-tight">Kural AI</h1>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-colors cursor-pointer border-2 border-transparent",
                  isActive
                    ? "bg-blue-50 text-[#1cb0f6] border-[#84d8ff]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t-2 border-gray-100">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wide text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  const navItems = [
    { href: "/learn", icon: Home, label: "Learn" },
    { href: "/chat", icon: MessageSquare, label: "AI Tutor" },
    { href: "/leaderboard", icon: Trophy, label: "Rank" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-2 z-50 flex justify-between items-center">
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <div className="flex flex-col items-center gap-1 p-2 cursor-pointer">
              <item.icon
                className={cn(
                  "w-6 h-6",
                  isActive ? "text-[#1cb0f6] fill-current" : "text-gray-400"
                )}
              />
              <span className={cn("text-xs font-bold uppercase", isActive ? "text-[#1cb0f6]" : "text-gray-400")}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
