'use client'
import { useState, FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  const [isAnimating, setIsAnimating] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') // "login" or "signup"
  const [isLogin, setIsLogin] = useState(initialMode !== 'signup') // default to login
  const redirect = searchParams.get('redirect') || '/dashboard'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const { error } = isLogin 
      ? await signIn(email, password)
      : await signUp(email, password)

    if (error) {
      setError(error.message)
    } else {
      if (isLogin) {
        router.push(redirect)
      } else {
        setError('')
        // Show success message or redirect to email confirmation
        setIsLogin(true)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    }
    setLoading(false)
  }

  const toggleMode = () => {
    setIsAnimating(true)
    setError('')
    
    // Fade out, then switch content and fade back in
    setTimeout(() => {
      setIsLogin(!isLogin)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setIsAnimating(false)
      }, 50) // Small delay before fading back in
    }, 300) // Wait for fade out to complete
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="relative w-full max-w-4xl h-[600px] bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        
        {/* Sliding Background Panel */}
        <div 
          className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-600 to-purple-600 transition-transform duration-700 ease-in-out ${
            isLogin ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-center h-full p-8 text-white">
            <div className="text-center">
              {isLogin ? (
                <>
                  <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                  <p className="text-lg mb-8 opacity-90">Enter your credentials to access your account</p>
                  <div className="space-y-2">
                    <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                    <div className="w-24 h-0.5 bg-white/50 mx-auto"></div>
                    <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold mb-6">Join Us Today!</h2>
                  <p className="text-lg mb-8 opacity-90">Create an account to get started on your journey</p>
                  <div className="space-y-2">
                    <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                    <div className="w-24 h-0.5 bg-white/50 mx-auto"></div>
                    <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className={`absolute top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
          isLogin ? 'right-0 opacity-100' : 'left-0 opacity-0 pointer-events-none'
        }`}>
          <div className={`w-full max-w-sm p-8 transition-opacity duration-300 ${isAnimating && isLogin ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Sign In</h3>
              <p className="text-white/70">Access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-white/70 mb-2">Don&apos;t have an account?</p>
              <button
                onClick={toggleMode}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className={`absolute top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
          !isLogin ? 'left-0 opacity-100' : 'right-0 opacity-0 pointer-events-none'
        }`}>
          <div className={`w-full max-w-sm p-8 transition-opacity duration-300 ${isAnimating && !isLogin ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-2">Sign Up</h3>
              <p className="text-white/70">Create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-white/70 mb-2">Already have an account?</p>
              <button
                onClick={toggleMode}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
    </div>
  )
}