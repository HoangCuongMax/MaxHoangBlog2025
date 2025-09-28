'use client'

"use client"

import { useState } from 'react'

interface PasswordProtectionProps {
  title: string
  onUnlock: (password: string) => void
  isUnlocking?: boolean
  error?: string
}

export default function PasswordProtection({ 
  title, 
  onUnlock, 
  isUnlocking = false, 
  error 
}: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim() && !isUnlocking) {
      onUnlock(password.trim())
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-2 border-black rounded-lg p-8">
          {/* Simple Lock Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-3 border-black rounded-lg flex items-center justify-center bg-white">
              <svg 
                className="w-8 h-8 text-black" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black mb-4">
              Protected Content
            </h1>
            <p className="text-gray-700 text-base leading-relaxed">
              &quot;{title}&quot; requires a password to access
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-4 border-2 border-black rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all text-lg ${
                  error ? 'border-red-600 bg-red-50' : 'bg-white'
                }`}
                disabled={isUnlocking}
              />
              
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
                disabled={isUnlocking}
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm font-medium text-center bg-red-50 p-3 rounded-lg border-2 border-red-200">
                ⚠ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!password.trim() || isUnlocking}
              className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              {isUnlocking ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Unlocking...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Unlock Content
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 font-medium">
              🔒 Premium content - password required
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
