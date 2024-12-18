'use client'

import React, { useState, useEffect } from 'react'

interface ToastProps {
    message: string
    duration?: number
    onClose?: () => void
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            if (onClose) onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    if (!isVisible) return null

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-up">
            {message}
        </div>
    )
}