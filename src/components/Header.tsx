'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-gray-900 rounded-lg p-2 border border-gray-700 group-hover:border-blue-500 transition-colors">
                <span className="text-xl">🛡️</span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                InboxShield
              </span>
              <span className="text-sm text-gray-400 ml-1">Mini</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                const element = document.getElementById('scan');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}