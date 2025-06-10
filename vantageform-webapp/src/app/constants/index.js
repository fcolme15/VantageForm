import yourlogo from "@/assets/yourlogo.svg"
import notification2 from "@/assets/notification/notification2.png";
import notification3 from "@/assets/notification/notification3.png";
import notification4 from "@/assets/notification/notification4.png";
import file02 from "@/assets/file-02.svg";
import searchMd from "@/assets/search-md.svg";
import plusSquare from "@/assets/plus-square.svg";

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


export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];
