'use client';

import { useState } from 'react';

interface DomainInputProps {
  onSubmit: (domain: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function DomainInput({ onSubmit, isLoading, error }: DomainInputProps) {
  const [domain, setDomain] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const validateDomain = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainPattern.test(trimmed) && trimmed.includes('.') && !trimmed.startsWith('.') && !trimmed.endsWith('.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);
    setIsValid(validateDomain(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(domain.trim().toLowerCase());
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Email Security Analysis
          </span>
        </h2>
        <p className="text-gray-300">
          Enter your domain to get instant email authentication analysis
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-3">
              Enter your domain name for instant analysis
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="yourcompany.com"
                  className={`w-full px-6 py-4 text-xl font-medium bg-gray-900/90 text-white placeholder-gray-400 border rounded-xl transition-all duration-300 outline-none ${
                    domain && !isValid 
                      ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
                      : isFocused || domain
                      ? 'border-blue-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  disabled={isLoading}
                />
                
                {/* Status Icon */}
                {domain && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isValid ? (
                      <div className="bg-green-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="bg-red-500 rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}

                {/* Loading indicator in input */}
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
            
            {domain && !isValid && (
              <div className="mt-3 flex items-center space-x-2 text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Please enter a valid domain (e.g., example.com)</span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-4 px-8 rounded-xl font-bold text-xl transition-all duration-300 transform relative overflow-hidden group ${
              isValid && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="relative z-10">
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  Analyzing Your Domain...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Get Free Security Scan
                </span>
              )}
            </span>
            {/* Animated background effect */}
            {isValid && !isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gray-700/50 rounded-lg px-4 py-2 border border-gray-600/50">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-300">
              Free preview • Full report with fixes only 
            </span>
            <span className="font-bold text-blue-400">$12</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Secure & private</span>
            </div>
          </div>
        </div>
    </div>
  );
}