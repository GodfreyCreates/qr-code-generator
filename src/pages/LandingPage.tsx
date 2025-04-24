import React from 'react';
import { QrCode } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Theme toggle for mobile/tablet screens */}
      <div className="absolute top-4 right-4 md:hidden">
        <ThemeToggle variant="minimal" />
      </div>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <QrCode size={32} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              Create Beautiful QR Codes <br className="hidden sm:block" />
              in Seconds
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Generate professional QR codes for your business, personal projects, or marketing campaigns. 
              Customize colors, add your logo, and track scans with our advanced QR code generator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth" 
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started for Free
              </a>
              <a 
                href="/auth" 
                className="btn-secondary text-lg px-8 py-3"
              >
                Login
              </a>
              <a 
                href="#features" 
                className="btn-outline text-lg px-8 py-3"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="mt-20" id="features">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Customizable Design',
                  description: 'Choose colors, add logos, and customize your QR codes to match your brand identity.'
                },
                {
                  title: 'Multiple Formats',
                  description: 'Export your QR codes in PNG, SVG, or JPEG format for any use case.'
                },
                {
                  title: 'Easy to Use',
                  description: 'Generate QR codes in seconds with our intuitive interface.'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;