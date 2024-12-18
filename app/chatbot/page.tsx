'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Send, LogOut, User } from 'lucide-react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { Toast } from '../components/Toast'

interface Message {
    text: string
    isUser: boolean
    timestamp: number
}

interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    stock: number
}

export default function ChatbotPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [userName, setUserName] = useState<string>('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid)
                    const userDocSnap = await getDoc(userDocRef)

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data()
                        setUserName(userData.name || 'User')
                        setMessages(userData.messages || [])
                    } else {
                        await setDoc(userDocRef, {
                            name: currentUser.displayName || 'User',
                            email: currentUser.email,
                            messages: []
                        })
                        setUserName(currentUser.displayName || 'User')
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                }
            } else {
                setShowToast(true)
                setTimeout(() => {
                    router.push('/')
                }, 1000)
            }
        })

        return () => unsubscribe()
    }, [router])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    const searchProducts = async (query: string): Promise<Product[]> => {
        try {
            const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`)
            if (!response.ok) {
                throw new Error('Failed to fetch products')
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error searching products:', error)
            return []
        }
    }

    const storeMessage = async (message: Message) => {
        try {
            const currentUser = auth.currentUser
            if (!currentUser) return

            const userDocRef = doc(db, 'users', currentUser.uid)
            await updateDoc(userDocRef, {
                messages: arrayUnion(message)
            })
        } catch (error) {
            console.error('Error storing message:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            setIsLoading(true)
            const userMessage: Message = { text: input, isUser: true, timestamp: Date.now() }
            setMessages(prev => [...prev, userMessage])
            await storeMessage(userMessage)
            setInput('')

            try {
                const searchResults = await searchProducts(input)
                setProducts(searchResults)

                let botResponse = ''
                if (searchResults.length > 0) {
                    botResponse = `I found ${searchResults.length} product${searchResults.length > 1 ? 's' : ''} matching your search. Here ${searchResults.length > 1 ? 'are some options' : 'is an option'}:\n\n` +
                        searchResults.slice(0, 3).map(product =>
                            `${product.name} - $${product.price.toFixed(2)}\n${product.description.slice(0, 100)}...`
                        ).join('\n\n')
                } else {
                    botResponse = "I couldn't find any products matching your search. Can you try different keywords?"
                }

                const botMessage: Message = { text: botResponse, isUser: false, timestamp: Date.now() }
                setMessages(prev => [...prev, botMessage])
                await storeMessage(botMessage)
            } catch (error) {
                console.error('Error processing message:', error)
                const errorMessage: Message = {
                    text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
                    isUser: false,
                    timestamp: Date.now()
                }
                setMessages(prev => [...prev, errorMessage])
                await storeMessage(errorMessage)
            } finally {
                setIsLoading(false)
            }
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
                {showToast && <Toast message="Sign in first" />}
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link href="/" className="flex items-center cursor-pointer">
                        <Bot className="h-8 w-8 text-green-500 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-900">ShopBot</h1>
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            <span className="sr-only">Open user menu</span>
                            <User className="h-5 w-5" />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                    Signed in as <span className="font-semibold">{userName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                                >
                                    <LogOut className="h-4 w-4 inline-block mr-2" />
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
                                        : 'bg-white text-gray-800'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs mt-1 opacity-75">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send</span>
                    </button>
                </form>
            </footer>
        </div>
    )
}