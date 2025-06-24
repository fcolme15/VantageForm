

import Header from "@/components/Header";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <div >
      <ProtectedRoute>
        <Header />
        <Dashboard/>
        <Footer/>
      </ProtectedRoute>
      <ButtonGradient />
      
    </div>
  );
}


export const metadata = {
  title: "VantageForm",
  icons: {
    icon: '/favicon.png',
  },
};
