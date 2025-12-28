"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquareText, BookOpen, Mic, ArrowRight, Sparkles, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

// Composant pour l'arrière-plan technique (Grid)
const BackgroundGrid = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]">
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-orange-500 opacity-20 blur-[100px]"></div>
    <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
  </div>
);

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-orange-500/30 overflow-x-hidden">
      <Header />
      
      <main className="flex-1 relative">
        <BackgroundGrid />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 lg:pt-52 lg:pb-40">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="flex flex-col items-center gap-8 text-center"
            >
              {/* Badge */}
              <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 px-3 py-1 text-sm text-orange-600 dark:text-orange-400 backdrop-blur-sm">
                <Sparkles className="mr-2 h-3.5 w-3.5 fill-orange-500" />
                <span className="font-medium">New: Real-time Voice Conversations</span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeIn} className="max-w-4xl">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                  Master Tamil with <br />
                  <span className="relative whitespace-nowrap">
                    <span className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">Intelligent AI</span>
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.p variants={fadeIn} className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
                Practice conversations, perfect your pronunciation, and decode Thirukkural with the world's most advanced Tamil AI tutor.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeIn} className="flex flex-col gap-4 sm:flex-row sm:justify-center w-full sm:w-auto mt-4">
                <Link href="/auth">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg shadow-orange-500/25 transition-all hover:scale-105">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-2 hover:bg-secondary/50 backdrop-blur-sm">
                    View Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Interactive Mock UI (Replacing the placeholder image) */}
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-20 relative w-full max-w-4xl mx-auto perspective-1000"
              >
                {/* Glow Effect behind the card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                
                {/* The Main App Window */}
                <div className="relative rounded-xl border bg-background/95 backdrop-blur shadow-2xl overflow-hidden ring-1 ring-white/10">
                  {/* Window Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="ml-4 text-xs text-muted-foreground font-medium flex items-center gap-2">
                      <Mic className="w-3 h-3" /> Tamil Tutor AI • Live Session
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="p-6 md:p-8 space-y-6 min-h-[300px] flex flex-col justify-end bg-gradient-to-b from-background to-muted/20">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                        <p className="font-medium">How do I greet someone formally?</p>
                      </div>
                    </div>

                    {/* AI Message */}
                    <div className="flex justify-start items-end gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        AI
                      </div>
                      <div className="space-y-2 max-w-[85%]">
                        <div className="bg-muted border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                          <p className="text-foreground font-medium mb-1">Vanakkam! (வணக்கம்) 🙏</p>
                          <p className="text-muted-foreground text-sm">
                            Use this for a formal greeting. It literally means "I bow to you".
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button className="text-xs bg-background hover:bg-accent border rounded-full px-3 py-1 flex items-center gap-1 transition-colors">
                              <Mic className="w-3 h-3" /> Listen
                            </button>
                            <button className="text-xs bg-background hover:bg-accent border rounded-full px-3 py-1 transition-colors">
                              Practice Saying it
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Simulation */}
                  <div className="p-4 border-t bg-background">
                    <div className="relative">
                      <input 
                        disabled 
                        placeholder="Type your reply..." 
                        className="w-full bg-muted/50 border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                      <div className="absolute right-2 top-2 p-1.5 bg-orange-500 rounded-full text-white">
                        <Send className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid (Bento Style) */}
        <section id="features" className="container px-4 md:px-6 py-24 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Why learn with us?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our platform combines cutting-edge AI technology with deep cultural understanding.</p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <FeatureCard 
              icon={<MessageSquareText className="h-6 w-6 text-white" />}
              title="AI Conversations"
              desc="Chat naturally in Tamil. Get instant real-time grammar corrections and cultural context notes."
              color="bg-orange-500"
              delay={0.1}
            />
            <FeatureCard 
              icon={<Mic className="h-6 w-6 text-white" />}
              title="Voice Practice"
              desc="Our speech engine analyzes your pronunciation accuracy and gives feedback on intonation."
              color="bg-blue-600"
              delay={0.2}
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-white" />}
              title="Thirukkural Mastery"
              desc="Decode ancient wisdom. Learn to recite verses with proper meter and understand their deep meaning."
              color="bg-purple-600"
              delay={0.3}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Sub-component for cleaner code
function FeatureCard({ icon, title, desc, color, delay }: { icon: React.ReactNode, title: string, desc: string, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-xl dark:hover:shadow-primary/10"
    >
      <div className={`absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full ${color} opacity-10 blur-2xl transition-all group-hover:scale-150 group-hover:opacity-20`}></div>
      
      <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color} shadow-lg shadow-orange-500/20`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
