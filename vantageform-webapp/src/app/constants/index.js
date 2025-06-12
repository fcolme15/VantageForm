

import discordIcon from "@/assets/socials/discord.svg";
import XIcon from "@/assets/socials/twitter.svg";
import instagramIcon from "@/assets/socials/instagram.svg";
import telegramIcon from "@/assets/socials/telegram.svg";
import facebookIcon from "@/assets/socials/facebook.svg";

export const navigation = [
    {
      id: "0",
      title: "Home",
      url: "#hero",
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
