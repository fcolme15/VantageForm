import yourlogo from "@/assets/yourlogo.svg"
import file02 from "@/assets/file-02.svg";
import searchMd from "@/assets/search-md.svg";
import plusSquare from "@/assets/plus-square.svg";

import discordIcon from "@/assets/socials/discord.svg";
import XIcon from "@/assets/socials/twitter.svg";
import instagramIcon from "@/assets/socials/instagram.svg";
import telegramIcon from "@/assets/socials/telegram.svg";
import facebookIcon from "@/assets/socials/facebook.svg";

export const navigation = [
    {
      id: "0",
      title: "Home",
      url: "#home",
    },
    {
      id: "1",
      title: "Dashboard",
      url: "#dashboard",
    },
    {
      id: "2",
      title: "About",
      url: "#about",
    },
    {
      id: "3",
      title: "Roadmap",
      url: "#roadmap",
    },
    {
      id: "4",
      title: "New account",
      url: "#signup",
      onlyMobile: true,
    },
    {
      id: "5",
      title: "Sign in",
      url: "#login",
      onlyMobile: true,
    },
  ];


export const heroIcons = [file02, searchMd, plusSquare];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const socials = [
  {
    id: "0",
    title: "X",
    iconUrl: XIcon,
    url: "http://x.com",
  },
  {
    id: "1",
    title: "Instagram",
    iconUrl: instagramIcon,
    url: "http://instagram.com",
  },
  {
    id: "2",
    title: "Facebook",
    iconUrl: facebookIcon,
    url: "http://facebook.com",
  },
  // {
  //   id: "0",
  //   title: "Discord",
  //   iconUrl: discordIcon,
  //   url: "http://discord.com",
  // },
  // {
  //   id: "3",
  //   title: "Telegram",
  //   iconUrl: telegramIcon,
  //   url: "http://telegram.com",
  // },
];
