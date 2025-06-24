
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from '../components/LoginForm'
import ButtonGradient from '@/assets/svg/ButtonGradient'
import AuthLoadingFallback from '@/components/LoginFormFallback'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-n-8 py-12">
      <Header/>
      <Suspense fallback={<AuthLoadingFallback/>}>
        <LoginForm />
      </Suspense>
      <Footer/>
      <ButtonGradient/>
    </div>
  )
}