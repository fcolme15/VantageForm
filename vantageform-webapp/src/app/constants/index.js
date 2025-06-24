

import XIcon from "@/assets/socials/twitter.svg";
import instagramIcon from "@/assets/socials/instagram.svg";
import facebookIcon from "@/assets/socials/facebook.svg";
import { BarChart3, TrendingUp, Zap } from 'lucide-react';

export const navigation1 = [
  {
    id: "0",
    title: "Home",
    url: "/",
  },
  {
    id: "1",
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    id: "2",
    title: "About",
    url: "/#about",
  },
  {
    id: "3",
    title: "Features",
    url: "/#features",
  },
  {
    id: "4",
    title: "Pricing",
    url: "/#pricing",
  },
  {
    id: "5",
    title: "New account",
    url: "/login?mode=signup",
    onlyMobile: true,
  },
  {
    id: "6",
    title: "Sign in",
    url: "/login?mode=login",
    onlyMobile: true,
  },
];

export const navigation2 = [
  {
    id: "0",
    title: "Home",
    url: "/",
  },
  {
    id: "1",
    title: "Dashboard",
    url: "/dashboard",
  },
  {
    id: "2",
    title: "About",
    url: "/#about",
  },
  {
    id: "3",
    title: "Features",
    url: "/#features",
  },
  {
    id: "4",
    title: "Pricing",
    url: "/#pricing",
  },
  {
    id: "5",
    title: "Sign Out",
    url: "/",
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
    description: "Explore predictions and player insights with limited access.",
    price: "Free",
    features: [
      "Access to AI-powered player predictions",
      "Limited number of daily searches",
      "Basic player comparison tools",
      "Save a small number of favorite profiles",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Unlock more predictions, comparisons, and saved profiles.",
    price: "9.99",
    features: [
      "All Basic features included",
      "Increased daily searches",
      "Expanded player comparison tools",
      "Save more profiles and search history",
      "Priority access to new features",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Built for professionals with high-volume access and direct collaboration.",
    price: null,
    features: [
      "All Premium features included",
      "High-volume prediction access",
      "Unlimited saved profiles and comparisons",
      "API access (coming soon)",
      "Direct communication with the VantageForm team",
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


