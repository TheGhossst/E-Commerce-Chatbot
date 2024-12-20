'use client'

import Link from 'next/link'
import { Bot } from 'lucide-react'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/api/lib/firebase'
import { db } from '@/api/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { User } from 'firebase/auth';

export function NavBar() {
    const [user, setUser] = useState<User | null>(null);
    const [userName, setUserName] = useState<string>('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
                const userDocRef = doc(db, 'users', currentUser.uid)
                const userDocSnap = await getDoc(userDocRef)
                if (userDocSnap.exists()) {
                    setUserName(userDocSnap.data().name || 'User')
                } else {
                    setUserName('User')
                }
            } else {
                setUser(null)
            }
        })

        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/')
        } catch (error) {
            console.error('Error signing out: ', error)
        }
    }

    return (
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Bot className="h-8 w-8 text-green-500" />
                        <span className="ml-2 text-xl font-bold text-gray-900">ShopBot</span>
                    </div>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white focus:outline-none"
                            >
                                {userName.charAt(0).toUpperCase()}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <div className="px-4 py-2 text-gray-700 font-semibold">
                                        {userName}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
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
                    )}
                </div>
            </div>
        </nav>
    )
}