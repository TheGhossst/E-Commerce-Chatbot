'use client'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword, onAuthStateChanged, AuthError } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Bot } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true)
        setTimeout(() => {
          router.push('/chatbot')
        }, 4000)
      }
    })

    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/chatbot')
    } catch (err) {
      const firebaseError = err as AuthError
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password')
          break
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later.')
          break
        default:
          setError('An error occurred. Please try again.')
      }
    }
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-[400px] text-center">
          <h1 className="text-2xl font-bold text-gray-900">You&apos;re logged in!</h1>
          <p className="text-gray-600 mt-2">
            Redirecting to the chatbot...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[400px]">
        <Link href="/">
          <div className="flex items-center justify-center mb-6">
            <Bot className="h-8 w-8 text-green-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">ShopBot</h1>
          </div>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-600 text-sm mt-2">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border text-black border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}