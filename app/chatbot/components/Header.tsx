'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Share2, User, LogOut, Check } from 'lucide-react'
import Link from 'next/link'

interface ChatHeaderProps {
    userName: string
    onLogout: () => void
}

export function ChatHeader({ userName, onLogout }: ChatHeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleShare = () => {
        navigator.clipboard.writeText("www.google.com").then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3">
                <Link href = "/">
                    <div className="flex items-center gap-2">
                        <Bot className="h-6 w-6 text-green-500" />
                        <h1 className="text-lg font-semibold text-gray-900">ShopBot</h1>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors relative"
                        onClick={handleShare}
                    >
                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
                        {copied && (
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2">
                                Copied!
                            </span>
                        )}
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            <User className="h-5 w-5" />
                        </button>
                        {dropdownOpen && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                            >
                                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                    Signed in as <span className="font-semibold">{userName}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 inline-block mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}