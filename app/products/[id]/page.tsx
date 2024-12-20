'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Product } from '@/app/types/type'
import { Loader2, AlertCircle, Package } from 'lucide-react'

export default function ProductPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const apiUrl = 'http://localhost:5000'
                const response = await fetch(`${apiUrl}/api/products/${id}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setProduct(data)
            } catch (error) {
                console.error('Error fetching product:', error)
                if (error instanceof Error) {
                    setError(`Failed to load product: ${error.message}`)
                } else {
                    setError('An unexpected error occurred. Please try again later.')
                }
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-xl font-semibold text-gray-700">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-100 to-yellow-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-2xl font-semibold text-gray-700">Product not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                        <p className="mt-2 text-lg text-gray-400 font-semibold">{product.category}</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                <dd className="mt-1 text-2xl font-semibold text-green-600 sm:mt-0 sm:col-span-2">
                                    ₹{product.price.toFixed(2)}
                                </dd>
                            </div>
                            <div className="bg-white px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                                <dt className="text-sm font-medium text-gray-500">Stock</dt>
                                <dd className="mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2">
                                    {product.stock} {product.stock === 1 ? 'unit' : 'units'} available
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2 leading-relaxed">
                                    {product.description}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}