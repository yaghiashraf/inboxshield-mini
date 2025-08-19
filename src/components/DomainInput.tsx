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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your domain name
          </label>
          <div className="relative">
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={handleInputChange}
              placeholder="example.com"
              className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
                domain && !isValid 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white'
              }`}
              disabled={isLoading}
            />
            {domain && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValid ? (
                  <span className="text-green-500 text-xl">✓</span>
                ) : (
                  <span className="text-red-500 text-xl">✗</span>
                )}
              </div>
            )}
          </div>
          {domain && !isValid && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid domain name (e.g., example.com)
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
            isValid && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Checking...
            </span>
          ) : (
            'Get Free Preview'
          )}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          Free preview shows issues found. 
          <span className="font-medium text-gray-700"> Full report with fixes costs $12</span>
        </p>
      </div>
    </div>
  );
}