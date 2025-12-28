import { useAuth } from "@/hooks/use-auth";
import { Button3D } from "@/components/ui/Button3D";
import { Redirect } from "wouter";
import { Globe, Languages, Sparkles } from "lucide-react";

export default function Landing() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) return <Redirect to="/learn" />;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#235390] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#58cc02]/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Kural AI</h1>
        <div className="hidden md:block">
           {/* Only show login if needed, though main CTA is below */}
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto px-6 py-12 gap-12 text-center md:text-left">
        
        {/* Left Side: Visual */}
        <div className="flex-1 flex justify-center animate-in slide-in-from-left duration-700 fade-in">
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Using colorful icons/shapes instead of stock image */}
            <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <Globe className="w-48 h-48 text-[#58cc02]" />
              <div className="absolute -right-4 -top-4">
                 <Languages className="w-16 h-16 text-[#ffc800] rotate-12" />
              </div>
              <div className="absolute -left-8 bottom-0">
                 <Sparkles className="w-12 h-12 text-[#1cb0f6] -rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Copy & CTA */}
        <div className="flex-1 max-w-md animate-in slide-in-from-right duration-700 fade-in delay-100">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            The free, fun, and effective way to learn Tamil!
          </h2>
          <div className="space-y-4">
            <Button3D 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={handleLogin}
              className="text-lg md:text-xl"
            >
              Get Started
            </Button3D>
            
            <Button3D 
              variant="secondary" 
              size="lg" 
              fullWidth 
              onClick={handleLogin}
              className="text-lg md:text-xl border-[#235390] bg-[#235390] hover:bg-[#204b82]"
            >
              I already have an account
            </Button3D>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-white/40 text-sm font-bold tracking-widest uppercase">
        <p>© 2025 Kural AI • Learn Tamil</p>
      </footer>
    </div>
  );
}
