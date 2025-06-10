import Head from "next/head";
import Header from "./components/Header";
import Scene from "./components/Scene";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Hero from "./components/Hero";


export default function Home() {
  return (
    <div className="w-full">
      {/* <section className="h-screen border-black">
        <Header />
      </section> */}
      <section className="h-screen border-black">
        <Hero />
      </section>
      <section className="h-screen border-black">
        <ButtonGradient />
      </section>
    </div>
  );
}
