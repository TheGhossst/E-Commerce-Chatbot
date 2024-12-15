import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  return <Chatbot />
}

function Chatbot() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">E-commerce Chatbot</h1>
      {/* Chatbot implementation will go here */}
    </div>
  )
}

