'use client';

interface ProviderLogosProps {
  className?: string;
}

export function ProviderLogos({ className = '' }: ProviderLogosProps) {
  // List of major DNS/email providers with icons
  const providers = [
    { name: 'GoDaddy', icon: '🌐' },
    { name: 'Cloudflare', icon: '☁️' },
    { name: 'Namecheap', icon: '💎' },
    { name: 'Google Domains', icon: '🔍' },
    { name: 'Route 53', icon: '🛣️' },
    { name: 'DNS Made Easy', icon: '⚡' },
    { name: 'Hover', icon: '🎯' },
    { name: 'Network Solutions', icon: '🔗' },
    { name: 'Gmail', icon: '✉️' },
    { name: 'Outlook', icon: '📧' },
    { name: 'Yahoo Mail', icon: '📮' },
    { name: 'Office 365', icon: '🏢' },
    { name: 'Google Workspace', icon: '🚀' },
    { name: 'Zoho Mail', icon: '📬' }
  ];

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="relative">
        {/* Gradient masks for smooth fade effect */}
        <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling container */}
        <div className="flex animate-scroll-left">
          {/* First set of logos */}
          <div className="flex items-center space-x-6 px-4">
            {providers.map((provider, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 flex items-center justify-center space-x-3 h-14 px-5 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300"
              >
                <span className="text-2xl">{provider.icon}</span>
                <span className="text-gray-300 font-medium text-sm whitespace-nowrap">
                  {provider.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center space-x-6 px-4">
            {providers.map((provider, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 flex items-center justify-center space-x-3 h-14 px-5 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300"
              >
                <span className="text-2xl">{provider.icon}</span>
                <span className="text-gray-300 font-medium text-sm whitespace-nowrap">
                  {provider.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}