import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"; // Assure-toi que le chemin est bon
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KuralAI - Learn Tamil with AI",
  description: "Master Tamil conversations and Thirukkural with your personal AI tutor.",
  icons: {
    icon: "/favicon.ico", // Pense à ajouter une icône plus tard
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* suppressHydrationWarning est OBLIGATOIRE quand on utilise next-themes 
       pour éviter les erreurs de mismatch entre le serveur et le client */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Ici, tu pourras ajouter ta Navbar plus tard pour qu'elle soit sur toutes les pages.
            Ex: <Navbar /> 
          */}

          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  );
}