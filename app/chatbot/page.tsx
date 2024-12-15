'use client'

import { useState } from 'react'
import { Bot, Send } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function ChatbotPage() {
    const router = useRouter()
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([])
    const [input, setInput] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            setMessages([...messages, { text: input, isUser: true }])
            // Here you would typically send the message to your AI backend
            // and get a response. For this example, we'll just echo the message.
            setTimeout(() => {
                setMessages(prev => [...prev, { text: `You said: ${input}`, isUser: false }])
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
                    <div className="flex items-center">
                        <Bot className="h-8 w-8 text-green-500 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-900">ShopBot</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Logout
                    </button>
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
                                className={`max-w-sm p-4 rounded-lg ${message.isUser ? 'bg-green-500 text-white' : 'bg-white'
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
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Send className="h-4 w-4 mr-2 inline-block" />
                        Send
                    </button>
                </form>
            </footer>
        </div>
    )
}