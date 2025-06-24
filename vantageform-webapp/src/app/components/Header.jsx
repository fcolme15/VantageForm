"use client";
import {disablePageScroll, enablePageScroll} from "scroll-lock";
import {navigation} from "@/constants";
import Button from "@/components/Button";
import MenuSvg from "@/assets/svg/MenuSvg";
import { HamburgerMenu } from "@/components/design/Header";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'

const Header = () => {
  const pathname = usePathname();
  const [openNavigation, setOpenNavigation] = useState(false);

  const { user, getAuthHeader, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut()
  }
  
  
  const toggleNavigation = () => {
    if (openNavigation){
      setOpenNavigation(false);
      enablePageScroll();
    }
    else{
      setOpenNavigation(true);
      disablePageScroll();
    }
  };
  
  const handleClick = () => {
    if (!openNavigation ){
      return;
    }
    enablePageScroll();
    setOpenNavigation(false);
  };
  
  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      } lg:bg-n-8/90 lg:backdrop-blur-sm`}
    >
      <div className="flex bg-n-8 items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="/#hero">
          <div className="flex items-center px-5 space-x-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-black flex items-center justify-center">
              <span className="text-[12px] font-bold leading-none text-black">FJC.</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">VantageForm</h1>
          </div>
        </a>
        
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[4.5rem] left-0 right-0 bottom-0 bg-n-8 z-40 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-50 flex flex-col items-center justify-center m-auto lg:flex-row">

          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              onClick={handleClick}
              className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                item.onlyMobile ? "lg:hidden" : ""
              } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-base lg:font-semibold ${
                item.url === pathname.hash ? "z-2 lg:text-n-1" : "lg:text-n-1/50"
              } lg:leading-5 lg:hover:text-n-1 xl:px-12 after:content-[''] after:absolute after:left-8 after:bottom-5 after:h-[2px] after:bg-n-1 after:transition-all after:duration-300 after:w-0 lg:hover:after:w-1/3`}
            >
              {item.title}
            </Link>
          ))}

          </div>
          <HamburgerMenu />
        </nav>
        
        {!user && (
          <Link href='/login?mode=signup' className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block lg:text-base">
            New Account
          </Link>
        )}

        {!user ? (
          <Button className="!hidden lg:!flex lg:!text-base lg:!font-semibold" href="/login?mode=login">
            Sign in
          </Button>
        ) : (
          <Button className="!hidden lg:!flex lg:!text-base lg:!font-semibold" onClick={signOut}>
            Sign out
          </Button>
        )}
        
        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;