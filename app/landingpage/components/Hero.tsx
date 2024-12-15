import { Bot, ShoppingCart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export function Hero(){
    return (
        <section
                className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Communicate With Your Customers Intelligently
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Transform your e-commerce business with AI-powered customer service.
                                Our chatbot handles inquiries 24/7, boosting sales and customer satisfaction.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                                <Link href = '/login'>
                                    <button
                                        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all duration-300 shadow-md"
                                    >
                                        Get Started
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative z-10">
                                <div className="w-full h-[400px] bg-green-100 rounded-2xl overflow-hidden shadow-lg relative">
                                    <Bot className="absolute bottom-0 right-0 w-64 h-64 text-green-500 transform translate-y-8 translate-x-8" />
                                    <div className="absolute top-8 left-8 bg-white p-4 rounded-lg shadow-xl flex items-center space-x-3">
                                        <MessageCircle className="h-6 w-6 text-green-500" />
                                        <p className="text-sm font-medium text-gray-700">
                                            Smart Responses
                                        </p>
                                    </div>
                                    <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-xl flex items-center space-x-3">
                                        <ShoppingCart className="h-6 w-6 text-green-500" />
                                        <p className="text-sm font-medium text-gray-700">
                                            Boost Sales
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    )
}