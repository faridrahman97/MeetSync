import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/CreateEvent";

export const metadata = {
  title: "MeetSync",
  description: "Effortless Calendar Coordination",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Header */}
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {children}
          </main>
          {/* Footer */}
          <footer className="bg-green-100 py-12">
            <div className="container mx-auto px-4 text-center text-slate-600">
              <p>© {new Date().getFullYear()} MeetSync</p>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}
