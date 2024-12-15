'use client'

import { useState, useEffect } from 'react'
import { Bot, Send } from 'lucide-react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'

export default function ChatbotPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
    const [input, setInput] = useState('')
    const [userName, setUserName] = useState<string>('')
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid)
                    const userDocSnap = await getDoc(userDocRef)

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data()
                        setUserName(userData.name || 'User')
                    } else {
                        console.log('No such document!')
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                }
            } else {
                router.push('/')
            }
        })

        return () => unsubscribe()
    }, [router])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            setMessages([...messages, { text: input, isUser: true }])
            setTimeout(() => {
                setMessages((prev) => [...prev, { text: `You said: ${input}`, isUser: false }])
            }, 1000)
            setInput('')
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/')
        } catch (error) {
            console.error('Error signing out: ', error)
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link href="/" className="flex items-center cursor-pointer">
                        <Bot className="h-8 w-8 text-green-500 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-900">ShopBot</h1>
                    </Link>

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
                </div>
            </header>
            <main className="flex-grow overflow-auto p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-sm p-4 rounded-lg ${message.isUser
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-black'
                                    }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Send className="h-4 w-4 mr-2 inline-block text-sm" />
                        Send
                    </button>
                </form>
            </footer>
        </div>
    )
}