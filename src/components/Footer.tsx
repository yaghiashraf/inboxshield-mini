'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gray-900 rounded-lg p-2 border border-gray-700">
                  <span className="text-xl">🛡️</span>
                </div>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  InboxShield
                </span>
                <span className="text-sm text-gray-400 ml-1">Mini</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional email deliverability audits for small businesses. Get your email security fixed in minutes, not hours.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a></li>
              <li><Link href="/stripe-test" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">🧪 Test Payment</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/setup" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">⚙️ Setup Guide</Link></li>
              <li><a href="mailto:support@inboxshield.com" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="mailto:support@inboxshield.com" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="https://status.inboxshield.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><a href="mailto:legal@inboxshield.com" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
              <li><a href="mailto:security@inboxshield.com" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 InboxShield Mini. All rights reserved. Built with ❤️ for email deliverability.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-400">🔒 SOC2 Compliant</span>
              <span className="text-gray-400">⚡ 99.9% Uptime</span>
              <span className="text-gray-400">🌍 Global CDN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}