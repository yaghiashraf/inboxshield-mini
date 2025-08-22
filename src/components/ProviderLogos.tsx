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
  // Major email providers with accurate brand logos
  const providers = [
    { 
      name: 'Google Workspace', 
      logo: (
        <LogoSVG name="Google Workspace">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#4285f4" d="M240 100.1c0-7.4-.7-14.5-1.9-21.5H128v40.7h62.7c-2.7 13.6-10.8 25.2-23 32.9v27.3h37.2c21.8-20.1 34.4-49.7 34.4-79.4z"/>
            <path fill="#34a853" d="M128 244c31.1 0 57.2-10.3 76.3-27.9l-37.2-27.3c-10.3 6.9-23.5 11-39.1 11-30 0-55.4-20.3-64.5-47.6H25.7v28.2C45 222.1 83.8 244 128 244z"/>
            <path fill="#fbbc04" d="M63.5 151.2c-2.3-6.9-3.6-14.3-3.6-21.8s1.3-14.9 3.6-21.8V79.4H25.7C18.6 93.4 15 110.2 15 128s3.6 34.6 10.7 48.6l37.8-25.4z"/>
            <path fill="#ea4335" d="M128 53.8c16.9 0 32.1 5.8 44.1 17.2l33.1-33.1C185.1 18.4 158.9 8 128 8 83.8 8 45 29.9 25.7 71.6l37.8 25.4c9.1-27.3 34.5-47.6 64.5-47.6z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Microsoft 365', 
      logo: (
        <LogoSVG name="Microsoft 365">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#ff5722" d="M121 121H0V0h121z"/>
            <path fill="#4caf50" d="M256 121H135V0h121z"/>
            <path fill="#03a9f4" d="M121 256H0V135h121z"/>
            <path fill="#ff9800" d="M256 256H135V135h121z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'SendGrid', 
      logo: (
        <LogoSVG name="SendGrid">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#1a82e2" d="M37.8 37.8h37.8v37.8H37.8zm75.6 0h37.8v37.8h-37.8zm75.6 0H227v37.8h-37.8zM37.8 113.4h37.8v37.8H37.8zm151.2 0H227v37.8h-37.8zM37.8 189h37.8v37.8H37.8zm75.6 0h37.8v37.8h-37.8zm75.6 0H227v37.8h-37.8z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Mailgun', 
      logo: (
        <LogoSVG name="Mailgun">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#f05133"/>
            <path fill="white" d="M128 45c45.8 0 83 37.2 83 83s-37.2 83-83 83-83-37.2-83-83 37.2-83 83-83zm0 20c-34.8 0-63 28.2-63 63s28.2 63 63 63 63-28.2 63-63-28.2-63-63-63z"/>
            <path fill="#f05133" d="M128 85c23.7 0 43 19.3 43 43s-19.3 43-43 43-43-19.3-43-43 19.3-43 43-43z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Mailchimp', 
      logo: (
        <LogoSVG name="Mailchimp">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#ffe01b" d="M128 10C62.8 10 10 62.8 10 128s52.8 118 118 118 118-52.8 118-118S193.2 10 128 10z"/>
            <path fill="#241c15" d="M128 40c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm-25 65c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15zm50 0c-8 0-15 7-15 15s7 15 15 15 15-7 15-15-7-15-15-15z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'HubSpot', 
      logo: (
        <LogoSVG name="HubSpot">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#ff7a59"/>
            <path fill="white" d="M128 45c-8 0-15 6-15 14v25h-20c-8 0-14 6-14 14s6 14 14 14h20v36c0 25 20 45 45 45s45-20 45-45v-36h20c8 0 14-6 14-14s-6-14-14-14h-20V59c0-8-7-14-15-14s-14 6-14 14v25h-31V59c0-8-7-14-15-14z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Constant Contact', 
      logo: (
        <LogoSVG name="Constant Contact">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#1f5f99"/>
            <path fill="white" d="M100 100h56c17 0 31 14 31 31v56c0 17-14 31-31 31h-56c-17 0-31-14-31-31v-56c0-17 14-31 31-31zm28 25c-20 0-36 16-36 36s16 36 36 36 36-16 36-36-16-36-36-36z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Campaign Monitor', 
      logo: (
        <LogoSVG name="Campaign Monitor">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#1976d2"/>
            <path fill="white" d="M180 100L128 152 76 100h104z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'ActiveCampaign', 
      logo: (
        <LogoSVG name="ActiveCampaign">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#1c3e5a"/>
            <path fill="#37cfee" d="M128 50c43 0 78 35 78 78s-35 78-78 78-78-35-78-78 35-78 78-78zm0 30c-27 0-48 21-48 48s21 48 48 48 48-21 48-48-21-48-48-48z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'ConvertKit', 
      logo: (
        <LogoSVG name="ConvertKit">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#fb6970"/>
            <path fill="white" d="M85 85h86c8 0 15 7 15 15v56c0 8-7 15-15 15H85c-8 0-15-7-15-15v-56c0-8 7-15 15-15z"/>
            <path fill="#fb6970" d="M128 110l-30 25 60-50-30 25z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Klaviyo', 
      logo: (
        <LogoSVG name="Klaviyo">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#000"/>
            <path fill="white" d="M70 70h30l45 60-45 56h-30l45-56-45-60zm86 0h30v116h-30V70z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Amazon SES', 
      logo: (
        <LogoSVG name="Amazon SES">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#ff9900" d="M50 180c40 30 100 30 140 0l-15-25c-30 20-80 20-110 0l-15 25z"/>
            <path fill="#232f3e" d="M40 40h176v100L128 200 40 140V40z"/>
            <path fill="#ff9900" d="M70 70h116v40L128 150 70 110V70z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Postmark', 
      logo: (
        <LogoSVG name="Postmark">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#ffdd57"/>
            <path fill="#363636" d="M70 90v76l58-38-58-38zm116 0l-58 38 58 38V90z"/>
            <path fill="#ffdd57" d="M128 128L70 90h116l-58 38z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Cloudflare', 
      logo: (
        <LogoSVG name="Cloudflare">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#f48120" d="M180 150c8-20-5-40-25-40H90l20-40c20-40 70-40 90 0l-20 40h40c20 0 35 15 35 35s-15 35-35 35h-40z"/>
            <path fill="#faad3f" d="M90 150h65c20 0 25 20 25 20H70s5-20 20-20z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'GoDaddy', 
      logo: (
        <LogoSVG name="GoDaddy">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#1baa6e"/>
            <path fill="white" d="M85 85c25 0 45 20 45 45v41c0 25-20 45-45 45s-45-20-45-45v-41c0-25 20-45 45-45zm86 0c25 0 45 20 45 45v41c0 25-20 45-45 45s-45-20-45-45v-41c0-25 20-45 45-45z"/>
            <circle cx="85" cy="110" r="15" fill="#1baa6e"/>
            <circle cx="171" cy="110" r="15" fill="#1baa6e"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Namecheap', 
      logo: (
        <LogoSVG name="Namecheap">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#de3910"/>
            <path fill="white" d="M50 100h40l20 56h-20l-40-56zm56 0h40l40 56h-20l-60-56zm100 0v56h-20v-56h20z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'GetResponse', 
      logo: (
        <LogoSVG name="GetResponse">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#00baff"/>
            <path fill="white" d="M70 90c0-10 10-20 20-20h76c10 0 20 10 20 20v76c0 10-10 20-20 20H90c-10 0-20-10-20-20V90zm40 20v56l40-28-40-28z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'AWeber', 
      logo: (
        <LogoSVG name="AWeber">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <circle cx="128" cy="128" r="128" fill="#1e73be"/>
            <path fill="white" d="M60 100h40l20 56 20-56h40l-35 56 35 56h-40l-20-56-20 56H60l35-56-35-56z"/>
          </svg>
        </LogoSVG>
      )
    },
    { 
      name: 'Salesforce', 
      logo: (
        <LogoSVG name="Salesforce">
          <svg viewBox="0 0 256 256" className="w-6 h-6">
            <path fill="#00a1e0" d="M90 100c30-20 70-10 80 20 20-10 40 0 50 20 10-5 25 5 25 20 0 15-15 25-30 20h-95c-20 0-35-15-35-35s15-35 35-35c-10-15 0-30 15-25 15-10 35 0 40 20l-85-5z"/>
            <circle cx="80" cy="120" r="25" fill="white" opacity="0.8"/>
            <circle cx="140" cy="110" r="20" fill="white" opacity="0.6"/>
            <circle cx="190" cy="130" r="15" fill="white" opacity="0.4"/>
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