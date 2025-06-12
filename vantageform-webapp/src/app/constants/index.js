

import discordIcon from "@/assets/socials/discord.svg";
import XIcon from "@/assets/socials/twitter.svg";
import instagramIcon from "@/assets/socials/instagram.svg";
import telegramIcon from "@/assets/socials/telegram.svg";
import facebookIcon from "@/assets/socials/facebook.svg";
import { BarChart3, TrendingUp, Zap } from 'lucide-react';

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



export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

export const benefits = [
  {
    id: 1,
    title: "Advanced ML Predictions",
    description: "Our machine learning models analyze thousands of data points to predict player performance, injury risks, and game outcomes with high accuracy.",
    icon: BarChart3,
    gradient: "from-blue-500 to-purple-600",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-500/10",
    stats: "Trained Models"
  },
  {
    id: 2,
    title: "Deep Learning Analytics",
    description: "Neural networks process real-time sports data, team dynamics, and historical patterns to deliver insights that traditional stats can't capture.",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
    borderColor: "border-emerald-500/50",
    bgColor: "bg-emerald-500/10",
    stats: "LLM from Game Data"
  },
  {
    id: 3,
    title: "Position-Aware Insights",
    description: "Get instant predictions and analytics powered by our optimized AI infrastructure. Make data-driven decisions in seconds, not hours.From quarterbacks to strikers to pitchers—VantageForm adapts to each sport and position, delivering accurate stat projections based on role-specific performance patterns.",
    icon: Zap,
    gradient: "from-orange-500 to-red-600",
    borderColor: "border-orange-500/50",
    bgColor: "bg-orange-500/10",
    stats: "Real-Time Queries"
  }
];