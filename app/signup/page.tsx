'use client'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword, AuthError, onAuthStateChanged } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Bot } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if the user is already signed in
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
    setError('')
    setSuccess('')
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    try {
      // Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Store additional data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
      })

      setSuccess('Account created! Redirecting to login page...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      const firebaseError = err as AuthError
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists')
          break
        case 'auth/weak-password':
          setError('Password should be at least 6 characters')
          break
        default:
          setError('Registration failed. Please try again.')
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
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-gray-600 text-sm mt-2">Join our community today</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full px-3 py-2 text-black border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-4"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-500" />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-center text-sm text-green-600">{success}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}