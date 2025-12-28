import { Button } from "@/components/ui/button";
import { Zap, Heart, Shield, Gem } from "lucide-react";

export default function ShopPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
                <p className="text-muted-foreground">Spend your hard-earned Gems on power-ups and cosmetics.</p>
            </div>

            {/* Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-lg flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Premium Power-ups</h2>
                    <p className="opacity-90">Boost your learning speed with these items.</p>
                </div>
                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Gem className="h-6 w-6 text-blue-300 fill-blue-300" />
                    <span className="font-bold text-xl">1,250</span>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Power-ups Section */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" /> Power-ups
                    </h3>
                    <div className="flex flex-col gap-4">
                        <ShopItem
                            icon={<Heart className="h-6 w-6 text-red-500 fill-red-500" />}
                            name="Streak Freeze"
                            description="Keep your streak alive even if you miss a day."
                            price={200}
                        />
                        <ShopItem
                            icon={<Shield className="h-6 w-6 text-blue-500 fill-blue-500" />}
                            name="Double XP"
                            description="Earn double XP for the next 30 minutes."
                            price={50}
                        />
                    </div>
                </section>

                {/* Cosmetics / Other */}
                <section className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Gem className="h-5 w-5 text-purple-500" /> Cosmetics
                    </h3>
                    <div className="flex flex-col gap-4">
                        <ShopItem
                            icon={<div className="h-6 w-6 rounded-full bg-gradient-to-tr from-primary to-orange-300" />}
                            name="Gold Avatar Border"
                            description="Shine on the leaderboard with a gold border."
                            price={1000}
                        />
                        <ShopItem
                            icon={<div className="h-6 w-6 rounded-full bg-black/10 flex items-center justify-center text-xs">🚀</div>}
                            name="Space Theme"
                            description="Change the app background to deep space."
                            price={500}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function ShopItem({ icon, name, description, price }: { icon: any, name: string, description: string, price: number }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-secondary/40 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold">{name}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button className="gap-2 min-w-[100px]">
                <Gem className="h-4 w-4" /> {price}
            </Button>
        </div>
    )
}
