'use client'

import { Send } from 'lucide-react'
import { FormEvent } from 'react'

interface ChatInputProps {
    input: string
    setInput: (value: string) => void
    onSubmit: (e: FormEvent) => void
    isLoading: boolean
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
    return (
        <div className="border-t border-gray-400 bg-white p-4">
            <form onSubmit={onSubmit} className="mx-auto max-w-3xl flex gap-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Message ShopBot..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-lg bg-white my-3 px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center my-3 justify-center rounded-lg bg-green-500 p-3 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    <Send className="h-5 w-5" />
                </button>
            </form>
        </div>
    )
}

