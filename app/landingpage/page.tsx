'use client'

import { NavBar } from './components/NavBar'
import { Hero } from './components/Hero'

export default function LandingPage() {

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <Hero />
        </div>
    )
}
