import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex flex-1 flex-col md:pl-72">
                <MobileHeader />
                <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
