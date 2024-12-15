import Link from 'next/link'
import { Bot } from 'lucide-react'

export function NavBar() {
    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Bot className="h-8 w-8 text-green-500" />
                        <span className="ml-2 text-xl font-bold text-gray-900">ShopBot</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/login">
                            <button className="px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-50 transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link href="/signup">
                            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}