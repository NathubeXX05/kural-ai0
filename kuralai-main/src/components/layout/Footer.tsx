import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t py-12 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-sm text-muted-foreground">© 2025 KuralAI. Built with ❤️ for Tamil.</p>
                <div className="flex gap-6">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Twitter</Link>
                </div>
            </div>
        </footer>
    )
}
