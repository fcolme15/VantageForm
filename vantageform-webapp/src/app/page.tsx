import Head from "next/head";
import Header from "./components/Header";
import Scene from "./components/Scene";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Hero from "./components/Hero";


export default function Home() {
  return (
    <div >
      <Header />
      <Hero />
      <div className="relative w-full h-[100vh]"/>
      <ButtonGradient />
    </div>
  );
}
