"use client"

import { useState } from "react"
import Calendar from "./components/Calendar"

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <div className="min-h-screen w-full bg-[#F5F3F0] flex items-center justify-center p-4 md:p-12">
      {/* Subtle background texture or gradient can go here */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#C26343_0.5px,transparent_0.5px)] bg-size-[24px_24px]" />
      
      <main className="relative z-10 w-full max-w-5xl">
        <Calendar
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />
      </main>
    </div>
  )
}