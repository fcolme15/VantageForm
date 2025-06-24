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
    
    
    var { error } = isLogin
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
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4">
      <div className="relative w-full max-w-4xl h-[600px] max-sm:h-screen max-sm:max-w-full bg-white/10 backdrop-blur-lg rounded-3xl max-sm:rounded-none shadow-2xl overflow-hidden border border-white/20">
        
        {/* Desktop Layout */}
        <div className="hidden sm:block">
          {/* Sliding Background Panel */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-emerald-600 to-green-600 transition-transform duration-700 ease-in-out ${
              isLogin ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-center h-full p-8 text-white">
              <div className="text-center">
                {isLogin ? (
                  <>
                    <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                    <p className="text-lg mb-8 opacity-90">Enter your credentials to access your account</p>
                    <div className="space-y-2 mb-8">
                      <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                      <div className="w-24 h-0.5 bg-white/50 mx-auto"></div>
                      <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/90 mb-4">Don't have an account?</p>
                      <button
                        onClick={toggleMode}
                        className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 backdrop-blur-sm border border-white/30"
                      >
                        Create Account
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold mb-6">Join Us Today!</h2>
                    <p className="text-lg mb-8 opacity-90">Create an account to get started on your journey</p>
                    <div className="space-y-2 mb-8">
                      <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                      <div className="w-24 h-0.5 bg-white/50 mx-auto"></div>
                      <div className="w-16 h-0.5 bg-white/30 mx-auto"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/90 mb-4">Already have an account?</p>
                      <button
                        onClick={toggleMode}
                        className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 backdrop-blur-sm border border-white/30"
                      >
                        Sign In
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className={`absolute top-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
            isLogin ? 'right-0' : 'left-0'
          }`}>
            <div className="w-full max-w-sm p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </h3>
                <p className="text-white/70">
                  {isLogin ? 'Access your account' : 'Create your account'}
                </p>
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
                      className={`w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all ${
                        isLogin ? 'focus:ring-emerald-500' : 'focus:ring-green-500'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:border-transparent backdrop-blur-sm transition-all ${
                        isLogin ? 'focus:ring-emerald-500' : 'focus:ring-green-500'
                      }`}
                      required
                    />
                  </div>
                  {!isLogin && (
                    <div>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all"
                        required
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white p-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    isLogin 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden h-full flex flex-col">
          {/* Mobile Header with Toggle */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </h2>
            <div className="flex bg-white/20 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isLogin 
                    ? 'bg-white text-emerald-600 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !isLogin 
                    ? 'bg-white text-emerald-600 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Mobile Form */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
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
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all"
                      required
                    />
                  </div>
                  {!isLogin && (
                    <div>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all"
                        required
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white p-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    isLogin 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse max-sm:hidden"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse max-sm:hidden"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-lime-500/20 rounded-full blur-xl animate-pulse max-sm:hidden"></div>
    </div>
  );
}