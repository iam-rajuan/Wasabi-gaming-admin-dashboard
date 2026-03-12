'use client'

import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar />

      {/* main wrapper shifted by sidebar width */}
      <div className="pl-[280px] flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 p-6 overflow-x-hidden">{children}</main>

        <footer className="py-6 text-center text-sm text-gray-500 bg-[#F9FAFB]">
          Aspiring School ©{new Date().getFullYear()}
        </footer>
      </div>
    </div>
  )
}
