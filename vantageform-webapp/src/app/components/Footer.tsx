'use client';
import Image from "next/image";
import Section from "./Section";
import { socials } from "../constants";

const Footer = () => {
  return (
    <Section
      className="!px-0 !py-10 bg-n-7"
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="footer"
    >
      <div className="container">
        <div className="bg-n-8 rounded-2xl px-8 py-6 mx-4">
          <div className="flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
            <p className="caption text-white lg:block">
              © {new Date().getFullYear()}. All rights reserved.
            </p>
            <ul className="flex gap-5 flex-wrap">
              {socials.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-n-1 rounded-full transition-colors hover:bg-n-7"
                  >
                    <Image
                      src={item.iconUrl}
                      alt={item.title}
                      width={16}
                      height={16}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;