
import Header from "./components/Header";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import About from "./components/About";
import Services from "./components/Services";
import Benefits from "./components/Benefits";
import Pricing from "./components/Pricing";

export default function Home() {
  return (
    <div >
      <Header />
      <Hero />
      <About/>
      <Services/>
      <Benefits/>
      <Pricing/>
      <Footer/>
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
