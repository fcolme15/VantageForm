'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from '../components/LoginForm'
import ButtonGradient from '@/assets/svg/ButtonGradient'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-n-8 py-12">
      <Header/>
      <LoginForm />
      <Footer/>
      <ButtonGradient/>
    </div>
  )
}