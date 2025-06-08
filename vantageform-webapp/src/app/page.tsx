import Head from "next/head";
import Image from "next/image";
import Header from "./components/Header";
import ButtonGradient from "./assets/svg/ButtonGradient";

export default function Home() {
  return (
    <div >
      <Header/>
      <ButtonGradient/>
    </div>
  );
}
