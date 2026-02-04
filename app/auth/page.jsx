'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { authData } from '@/lib/data/authData';
import { Mail, Lock, User, CheckCircle, Layers, Activity } from 'lucide-react';

const iconMap = {
  mail: Mail,
  lock: Lock,
  user: User,
  'check-circle': CheckCircle,
  layers: Layers,
  activity: Activity
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const { branding, forms } = authData;
  const currentForm = forms[activeTab];
  const Logo = iconMap[branding.logo];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup';
      
      // Map form field IDs to API expected fields
      const payload = activeTab === 'login' 
        ? {
            email: data.email,
            password: data.password
          }
        : {
            fullName: data.fullname,
            email: data['signup-email'],
            password: data['signup-password'],
            confirmPassword: data['confirm-password']
          };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(activeTab === 'login' ? 'Login successful!' : 'Account created successfully!', {
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        
        // Redirect based on user role
        setTimeout(() => {
          if (result.user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/user');
          }
        }, 500);
      } else {
        toast.error(result.message || 'Authentication failed', {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      const errorMsg = 'An error occurred. Please try again.';
      toast.error(errorMsg, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
      setError(errorMsg);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderSocialButton = (provider) => {
    const svgMap = {
      Google: (
        <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      ),
      GitHub: (
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    };
    
    return svgMap[provider.name] || null;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8 bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Glassmorphic Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-700 font-medium">{activeTab === 'login' ? 'Signing in...' : 'Creating account...'}</p>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="pt-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white mb-3">
            {Logo && <Logo className="w-6 h-6" />}
          </div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{branding.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{branding.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="px-8 mb-6">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {forms.login.title}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {forms.signup.title}
            </button>
          </div>
        </div>

        {/* Fixed Social Auth Section */}
        <div className="px-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toast.info('Google OAuth coming soon!', { duration: 3000 })}
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => toast.info('GitHub OAuth coming soon!', { duration: 3000 })}
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 text-xs">
                {activeTab === 'login' ? 'Or continue with email' : 'Or sign up with email'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Form Content */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="space-y-4 min-h-[320px]" onSubmit={handleSubmit}>
            {currentForm.fields.map((field) => {
              const Icon = iconMap[field.icon];
              
              return (
                <div key={field.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {field.forgotPassword && (
                      <button
                        type="button"
                        onClick={() => console.log('Forgot password - coming soon')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white"
                      placeholder={field.placeholder}
                    />
                  </div>
                  {field.helper && (
                    <p className="mt-1 text-xs text-gray-500">{field.helper}</p>
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors mt-2 ${
                loading ? 'bg-gray-400 cursor-not-allowed' :
                activeTab === 'login'
                  ? 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-900'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {loading ? 'Please wait...' : currentForm.submitButton.text}
            </button>
          </form>

          {/* Terms (Signup only) */}
          {activeTab === 'signup' && currentForm.terms && (
            <p className="mt-4 text-center text-xs text-gray-500">
              {currentForm.terms.text}{' '}
              {currentForm.terms.links.map((link, index) => (
                <span key={index}>
                  <Link
                    href={index === 0 ? '/terms' : '/privacy'}
                    className="text-blue-600 hover:underline"
                  >
                    {link.text}
                  </Link>
                  {index < currentForm.terms.links.length - 1 && ' and '}
                </span>
              ))}
              .
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            &copy; {branding.year} {branding.name}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}