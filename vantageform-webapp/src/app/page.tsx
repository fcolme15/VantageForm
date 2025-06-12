import Head from "next/head";
import Header from "./components/Header";
import Scene from "./components/Scene";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import About from "./components/About";
import Services from "./components/Services";
import Benefits from "./components/Benefits";

export default function Home() {
  return (
    <div >
      <Header />
      <Hero />
      <About/>
      <Services/>
      <Benefits/>
      <Footer/>
      <ButtonGradient />
    </div>
  );
}
