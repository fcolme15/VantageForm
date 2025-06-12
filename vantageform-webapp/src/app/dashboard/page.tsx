
import Head from "next/head";
import Header from "@/components/Header";
import ButtonGradient from "@/assets/svg/ButtonGradient";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div >
      <Header />
      <Dashboard/>
      <Footer/>
      <ButtonGradient />
    </div>
  );
}
