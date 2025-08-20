'use client';

interface ProviderLogosProps {
  className?: string;
}

const LogoSVG = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div className="w-8 h-8 flex items-center justify-center">
    {children}
  </div>
);

export function ProviderLogos({ className = '' }: ProviderLogosProps) {
  // List of major DNS/email providers with actual logos
  const providers = [
    { 
      name: 'GoDaddy', 
      logo: (
        <LogoSVG name="GoDaddy">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Cloudflare', 
      logo: (
        <LogoSVG name="Cloudflare">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
            <path d="M5.5 16L3 12.5 5.5 9h13l2.5 3.5L18.5 16h-13z"/>
            <path d="M12 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z" fill="none" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Namecheap', 
      logo: (
        <LogoSVG name="Namecheap">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Google Domains', 
      logo: (
        <LogoSVG name="Google Domains">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Route 53', 
      logo: (
        <LogoSVG name="Route 53">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-400">
            <path d="M7 7v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1zm2.5 2h5c.28 0 .5.22.5.5s-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5zm0 2h5c.28 0 .5.22.5.5s-.22.5-.5.5h-5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5zm0 2h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/>
            <path d="M2 4v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2zm2 0h16v16H4V4z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Gmail', 
      logo: (
        <LogoSVG name="Gmail">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.5 4.64 12 9.548l6.5-4.908 1.573-1.147C21.69 2.28 24 3.434 24 5.457z" fill="#D44638"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Outlook', 
      logo: (
        <LogoSVG name="Outlook">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
            <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.83 0-.43.1-.85.1-.42.34-.78.23-.34.58-.54.35-.2.87-.2t.86.2q.35.2.57.54.22.34.31.78.1.4.1.85zM1.14 8.17v7.66q0 .31.23.54.22.22.53.22h3.86q.31 0 .54-.22.22-.23.22-.54V8.17q0-.31-.22-.53-.23-.23-.54-.23H1.9q-.31 0-.53.23-.23.22-.23.53zm6.9 0v7.66q0 .31.23.54.22.22.54.22h12.28q.31 0 .54-.22.22-.23.22-.54V8.17q0-.31-.22-.53-.23-.23-.54-.23H8.81q-.32 0-.54.23-.23.22-.23.53z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Yahoo Mail', 
      logo: (
        <LogoSVG name="Yahoo Mail">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
            <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.127.931s-1.125.04-1.127-.931c-.001-.971.541-2.317.541-2.317.671-1.552 1.913-4.119 1.913-4.119.284-.619.251-1.271.251-1.271 0 0-.102-.356-.102-.475 0-.296.15-.475.15-.475s.15-.119.15-.357c.001-.238-.15-.357-.15-.357s-.15-.238-.15-.357c0-.119.15-.238.15-.238s.284-.357.551-.357.551.238.551.238.15.119.15.238c0 .119-.15.238-.15.357s-.15.119-.15.357.15.238.15.357-.15.179-.15.475c0 .119-.102.475-.102.475 0 0-.034.652.251 1.271 0 0 1.242 2.567 1.913 4.119 0 0 .542 1.346.541 2.317-.002.971-1.127.931-1.127.931s-.511.143-1.127-.931c-.636-1.18-1.917-3.796-2.853-5.728z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Office 365', 
      logo: (
        <LogoSVG name="Office 365">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
            <path d="M2 3v18l6-3V6z" fill="#ea3e23"/>
            <path d="M22 3H8l6 9-6 9h14V3z" fill="#fff"/>
            <path d="M22 3H8v18h14V3z" fill="none" stroke="#ea3e23" strokeWidth="1"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Google Workspace', 
      logo: (
        <LogoSVG name="Google Workspace">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M6 2c-1.105 0-2 .895-2 2v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8.414c0-.526-.214-1.042-.586-1.414l-4.828-4.828A2.002 2.002 0 0 0 13.172 2H6zm0 2h7v4c0 .552.448 1 1 1h4v11H6V4z" fill="#4285F4"/>
            <path d="M14 2v4c0 .552.448 1 1 1h4" fill="none" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Zoho Mail', 
      logo: (
        <LogoSVG name="Zoho Mail">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
            <path d="M1.5 6.5v11A2.5 2.5 0 0 0 4 20h16a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 20 4H4a2.5 2.5 0 0 0-2.5 2.5zm4.5 0L12 12l6-5.5H6zm-2.5 1.2L9.4 12 3.5 16.8V7.7zm2.1 9.8L12 12l6.9 5.5H5.6zm13.9-1.7L14.6 12l5.9-4.3v8.6z" fill="#d94f3d"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'DigitalOcean', 
      logo: (
        <LogoSVG name="DigitalOcean">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
            <path d="M12 6v6h6c0-3.314-2.686-6-6-6z" fill="#0080ff"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Hostinger', 
      logo: (
        <LogoSVG name="Hostinger">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.2L19.5 8 12 11.8 4.5 8 12 4.2zM4 9.47l7 3.5v7.53l-7-3.5V9.47zm16 0v7.53l-7 3.5v-7.53l7-3.5z"/>
          </svg>
        </LogoSVG>
      )
    }
  ];

  return (
    <div className={`provider-marquee w-full overflow-hidden ${className}`}>
      <div className="relative h-20 flex items-center">
        {/* Enhanced gradient masks for smoother fade effect */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none"></div>
        
        {/* Continuous scrolling marquee */}
        <div className="marquee-track flex items-center animate-marquee">
          {/* First set of logos */}
          <div className="marquee-content flex items-center">
            {providers.map((provider, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 flex items-center justify-center mx-8 group cursor-pointer"
              >
                <div className="flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-300 hover:bg-gray-800/30">
                  <div className="provider-logo opacity-70 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0">
                    {provider.logo}
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-200 font-medium text-sm whitespace-nowrap transition-colors duration-300">
                    {provider.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Seamless duplicate set */}
          <div className="marquee-content flex items-center">
            {providers.map((provider, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 flex items-center justify-center mx-8 group cursor-pointer"
              >
                <div className="flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-300 hover:bg-gray-800/30">
                  <div className="provider-logo opacity-70 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0">
                    {provider.logo}
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-200 font-medium text-sm whitespace-nowrap transition-colors duration-300">
                    {provider.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}