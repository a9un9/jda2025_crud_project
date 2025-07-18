import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRUD Product App",
  description: "Aplikasi CRUD produk dengan Next.js + Prisma + Neon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <Toaster position="top-right" />
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600 mb-10">🚀 CRUD App</h1>
              <nav className="space-y-2 font-medium text-gray-700">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/products"
                  className="block px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  📦 Produk
                </Link>
              </nav>
            </div>
            <div className="text-sm text-gray-400">© {new Date().getFullYear()} JDA Apps</div>
          </aside>

          {/* Main Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
              <Link
                href="/dashboard"
                className="text-xl font-semibold tracking-tight text-gray-800 hover:text-blue-600 transition-colors duration-200"
              >
                Manajemen Produk
              </Link>
              <div className="text-sm text-gray-500">
                Dibuat dengan <span className="font-semibold text-blue-600">Next.js</span>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
