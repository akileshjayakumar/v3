"use client";

import { Button } from "@/components/ui/button";
import {
  Mail,
  ExternalLink,
  Globe,
  Menu,
  FileText,
  MessageCircle,
  X,
  Calendar,
  GraduationCap,
  Briefcase,
  BookOpen,
  FolderKanban,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import {
  SiNextdotjs,
  SiVercel,
  SiTypescript,
  SiLangchain,
  SiPerplexity,
  SiSupabase,
} from "react-icons/si";
import { FaMedium } from "react-icons/fa";
import Image from "next/image";

import AnimatedChatButton from "@/components/animated-chat-button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FaXTwitter } from "react-icons/fa6";
import React from "react";

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isOpening, setIsOpening] = React.useState(false);

  // Helper function to render tech logo with React Icon component
  const renderTechLogo = (
    condition: boolean,
    href: string,
    label: string,
    icon: React.ReactNode
  ) => {
    if (!condition) return null;
    return (
      <a
        key={href}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-out group border border-gray-200 dark:border-gray-300"
        aria-label={label}
      >
        {icon}
      </a>
    );
  };

  // Helper function to render tech logo with image
  const renderTechLogoImage = (
    condition: boolean,
    href: string,
    label: string,
    src: string,
    fallbackSrc?: string,
    style?: React.CSSProperties
  ) => {
    if (!condition) return null;
    return (
      <a
        key={href}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-out group border border-gray-200 dark:border-gray-300"
        aria-label={label}
      >
        <img
          src={src}
          alt={label}
          className="w-4 h-4 object-contain"
          style={style}
          onError={(e) => {
            if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.src = fallbackSrc;
              if (style) e.currentTarget.style.filter = "none";
            }
          }}
        />
      </a>
    );
  };

  const handleOpenMenu = () => {
    setMenuOpen(true);
    setIsOpening(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      setIsOpening(false);
    }, 300);
  };

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);

      document.body.style.overflow = "unset";
    }, 300);
  };

  React.useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const projects = [
    {
      id: "itallleadstodoom",
      title: "It All Leads to Doom",
      icon: "/avengers-logo.png",
      iconBg: "bg-white",
      description: [
        "A fun countdown clock for the upcoming marvel cinematic event - Avengers: Doomsday.",
        "Features a real-time countdown to the film's release date.",
      ],
      date: "January 2026",
      status: "Side Project",
      tech: ["Next.js", "Vercel", "TypeScript", "Google Antigravity"],
      links: {
        demo: "https://itallleadstodoom.vercel.app/",
        marketing: "https://x.com/sentrytoast/status/2006585828752183610",
        github: "https://github.com/akileshjayakumar/itallleadstodoom",
        marketingLabel: "X/Twitter Post",
      },
    },
    {
      id: "the-prompt-detective",
      title: "The Prompt Detective",
      icon: "🔍",
      iconBg: "bg-white",
      description: [
        <>
          An AI-powered game that teaches the CO-STAR framework through
          detective-style mystery cases. ~ Game inspired by{" "}
          <a
            href="https://www.tech.gov.sg/technews/mastering-the-art-of-prompt-engineering-with-empower/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
          >
            GovTech Singapore CO-STAR Framework
          </a>
          .
        </>,
        "Features unique AI-generated cases powered by Google Gemini 3 Flash.",
      ],
      date: "December 2025",
      status: "Side Project",
      tech: [
        "Next.js",
        "Vercel",
        "Tailwind CSS",
        "Google Gemini 3 Flash",
        "Google Antigravity",
      ],
      links: {
        demo: "https://thepromptdetective.vercel.app/",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7410968273112084480/",
        github: "https://github.com/akileshjayakumar/the-prompt-detective",
        marketingLabel: "LinkedIn Post",
      },
    },
    {
      id: "guesssg",
      title: "GuessSG",
      icon: "🦁",
      iconBg: "bg-white",
      description: [
        "A Wordle-style word guessing game that lets players guess words based on Singapore food, landmarks, and local slang.",
        "Features AI-powered hints using Perplexity API and real-time feedback on guesses.",
      ],
      date: "December 2025",
      status: "Side Project",
      tech: [
        "Next.js",
        "Vercel",
        "TypeScript",
        "Tailwind CSS",
        "Supabase",
        "Perplexity API",
      ],
      links: {
        demo: "https://gusss-singapore.vercel.app/",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7404812112889450497/",
        github: "https://github.com/akileshjayakumar/guess-singapore",
        marketingLabel: "LinkedIn Post",
      },
    },
    {
      id: "doodlemorph",
      title: "DoodleMorph",
      icon: "🎨",
      iconBg: "bg-white",
      description: [
        "Built an app that transforms your doodles/sketches into creative images, character designs, and cinematic animations.",
        "Used fal for media generation and Groq for fast prompt enhancements.",
      ],
      date: "October 2025",
      status: "Cursor Hackathon Singapore 2025",
      tech: ["Next.js", "Vercel", "TLDraw", "Fal.AI", "Google Gemini", "Groq"],
      links: {
        demo: "https://doodlemorph.vercel.app/",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7385710583221817344/",
        github: "https://github.com/akileshjayakumar/doodlemorph",
        marketingLabel: "LinkedIn Post",
        event: "https://luma.com/cursor-hack-sg?tk=Nxhea6",
      },
    },
    {
      id: "hawker-helper",
      title: "Hawker Food Menu Helper",
      icon: "🍜",
      iconBg: "bg-white",
      description: [
        "Upload a hawker centre menu photo to extract all dishes and prices.",
        "Get healthy and value picks, and chat to explore the menu.",
      ],
      date: "August 2025",
      status: "EMERGENCY GPT HACKATHON 2025",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Groq", "Vercel AI SDK"],
      links: {
        demo: "https://emergency-gpt-hackathon-2025.vercel.app/",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7360651593400135683/",
        github:
          "https://github.com/akileshjayakumar/emergency-gpt-hackathon-2025",
        marketingLabel: "LinkedIn Post",
        event: "https://luma.com/dn2iqbwu?tk=kM5Qjp",
      },
    },
    {
      id: "deeppurple",
      title: "DeepPurple",
      icon: "🧠",
      iconBg: "bg-white",
      description: [
        "Built a cloud-based multimodal GenAI platform to analyse customer emotions, sentiment, and key topics.",
        "Deployed on AWS with RESTful APIs for automated, scalable analysis tasks across uploaded files and chat data.",
      ],
      date: "April 2025 - September 2025",
      status: "UOW Final Year Capstone Project",
      tech: [
        "OpenAI",
        "Next.js",
        "Docker",
        "LangChain",
        "AWS Elastic Beanstalk",
        "AWS Amplify",
        "AWS S3",
        "AWS RDS",
      ],
      links: {
        demo: "https://main.d3dfvkthq7122n.amplifyapp.com/login",
        marketing: "https://deeppurple-fyp-25-s2-05-website.vercel.app/",
        github: "https://github.com/akileshjayakumar/deeppurple-fyp-25-s2-05",
        marketingLabel: "Marketing Website",
      },
    },
    {
      id: "prompttacular",
      title: "PromptTacular",
      icon: "🔄",
      iconBg: "bg-white",
      description: [
        "A high-precision assistant that rewrites and generates prompts and prompt templates.",
        "Runs inside Perplexity Spaces and generates prompts from descriptions and produces prompt templates for devs using LangChain and LlamaIndex.",
      ],
      date: "April 2025",
      status: "Side Project",
      tech: ["Perplexity Spaces"],
      links: {
        demo: "https://www.perplexity.ai/spaces/prompttacular-kWSdzdeGRMyTLgnG5NmzFg",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7320364815191879680/",
        github: "https://github.com/akileshjayakumar/perplexity-spaces-prompts",
        marketingLabel: "LinkedIn Post",
      },
    },
    {
      id: "edux",
      title: "EduX",
      icon: "📚",
      iconBg: "bg-white",
      description: [
        "Interactive AI tutor application that processes PDFs, PowerPoint files, and images for multimodal learning.",
        "Features speech-to-text, text-to-speech capabilities, and support for accessibility.",
      ],
      date: "October 2024",
      status: "NES CatalystX Hackathon 2024",
      tech: ["Streamlit", "NVIDIA NIM", "LlamaIndex"],
      links: {
        demo: "https://eduxcatalystx2024.streamlit.app/",
        github:
          "https://github.com/akileshjayakumar/nes-catalystx-hackathon-2024",
      },
    },
  ];

  const navItems = [
    { label: "education", href: "#education" },
    { label: "experience", href: "#experience" },
    { label: "writing", href: "#writing" },
    { label: "projects", href: "#projects" },
    { label: "contact", href: "#contact" },
    { label: "resume", href: "/cv" },
  ];

  const chatItem = { label: "chat", href: "/chat" };

  // Helper function to get icon component for nav items
  const getNavIcon = (label: string) => {
    const iconProps = {
      className: "h-6 w-6 text-gray-800 dark:text-[#f2f1ec]",
    };
    switch (label) {
      case "education":
        return <GraduationCap {...iconProps} />;
      case "experience":
        return <Briefcase {...iconProps} />;
      case "writing":
        return <BookOpen {...iconProps} />;
      case "projects":
        return <FolderKanban {...iconProps} />;
      case "contact":
        return <Mail {...iconProps} />;
      case "resume":
        return <FileText {...iconProps} />;
      case "chat":
        return <MessageCircle {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Desktop Icon Navigation Sidebar - Desktop Only */}
      <nav
        className="hidden md:flex fixed top-1/2 -translate-y-1/2 z-40"
        style={{
          left: "max(1rem, calc((100vw - 64rem) / 2 - 80px))",
        }}
      >
        <div className="flex flex-col space-y-2 bg-white/95 dark:bg-[#171717]/95 backdrop-blur-sm rounded-full px-3 py-4 border border-gray-200/50 dark:border-[#f2f1ec]/20 shadow-lg">
          {navItems
            .filter((item) => item.label !== "chat")
            .map((item) => {
              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (!item.href.startsWith("#")) return;
                e.preventDefault();
                const target = document.querySelector(item.href);
                if (target) {
                  target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                  try {
                    history.replaceState(null, "", item.href);
                  } catch {}
                }
              };

              return (
                <div key={item.label} className="group relative">
                  <a
                    href={item.href}
                    onClick={handleClick}
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#242424] transition-colors duration-200"
                    aria-label={item.label}
                  >
                    {getNavIcon(item.label)}
                  </a>
                  {/* Custom hover label */}
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                    <div className="px-3 py-1.5 rounded-md bg-gray-900 dark:bg-[#242424] border border-gray-700 dark:border-[#f2f1ec]/30 shadow-lg backdrop-blur-sm">
                      <p className="text-sm font-medium text-white dark:text-[#f2f1ec] capitalize">
                        {item.label}
                      </p>
                    </div>
                    {/* Arrow pointer */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-gray-700 dark:border-r-[#f2f1ec]/30"></div>
                  </div>
                </div>
              );
            })}
        </div>
      </nav>

      {/* Theme Toggle - Upper Right Corner (Desktop/Tablet) */}
      <div className="hidden sm:block fixed top-4 right-4 z-50 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      {/* Mobile Controls - Fixed Top with Backdrop Blur */}
      {!menuOpen && (
        <div
          className="sm:hidden fixed top-0 left-0 right-0 z-[9999] flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-[#171717]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-[#f2f1ec]/10 transition-all duration-300 safe-top"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-[#242424] border border-gray-200 dark:border-[#f2f1ec]/20">
              <Image
                src="/photo.jpg"
                alt="Akilesh Jayakumar"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-[#f2f1ec]">
              Akilesh
            </span>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={handleOpenMenu}
              className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-[#242424] text-gray-900 dark:text-[#f2f1ec]"
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {(menuOpen || isClosing) && (
        <div className="sm:hidden fixed inset-0 z-50 flex items-start justify-end">
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
              isClosing ? "opacity-0" : "opacity-100"
            }`}
            onClick={handleCloseMenu}
          />

          <div
            className={`relative bg-white dark:bg-[#171717] w-80 max-w-[90vw] h-full shadow-xl transition-transform duration-300 ease-out ${
              isClosing
                ? "translate-x-full"
                : isOpening
                ? "translate-x-full"
                : "translate-x-0"
            }`}
          >
            <button
              onClick={handleCloseMenu}
              className="absolute right-4 top-4 z-50 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#242424] transition-colors duration-200 focus:outline-none bg-white dark:bg-[#171717] shadow-sm"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-red-500" />
            </button>

            <nav className="flex flex-col py-6 px-6 space-y-4 mt-16">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-xl font-medium text-gray-700 dark:text-[#f2f1ec] hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors flex items-center gap-2 py-2"
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                      handleCloseMenu();
                      const href = item.href;
                      setTimeout(() => {
                        const target = document.querySelector(href);
                        if (target) {
                          target.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                          try {
                            history.replaceState(null, "", href);
                          } catch {}
                        }
                      }, 400);
                    } else {
                      handleCloseMenu();
                    }
                  }}
                >
                  {item.label === "chat" && (
                    <MessageCircle className="h-4 w-4" />
                  )}
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-6 sm:py-8 sm:pl-14">
        <div className="mb-12 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="hidden sm:block w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-[#242424]">
                <Image
                  src="/photo.jpg"
                  alt="Akilesh Jayakumar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Desktop Chat Button - Top Right */}
            <nav className="hidden sm:flex items-center">
              <AnimatedChatButton
                href={chatItem.href}
                className="text-base font-medium text-gray-500 dark:text-[#f2f1ec]/70 hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors chat-button-animated px-3 py-2 rounded-md flex items-center"
              >
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 chat-icon-bounce" />
                  {chatItem.label}
                </span>
              </AnimatedChatButton>
            </nav>
          </div>
          <div className="mt-6">
            <h1 className="hidden sm:block text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f2f1ec]">
              Akilesh Jayakumar
            </h1>
            <p className="text-gray-700 dark:text-[#f2f1ec]/80 leading-relaxed mt-2 mb-6 text-base sm:text-lg">
              exploring / experimenting with GenAI & LLMs
            </p>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-5 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 hover:bg-transparent"
              asChild
            >
              <a
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="icon-link group"
              >
                <FaXTwitter className="!h-[18px] !w-[18px] sm:!h-[22px] sm:!w-[22px] transition-all duration-200 ease-out group-hover:scale-105 text-gray-900 dark:text-[#f2f1ec] hover:text-gray-900 dark:hover:text-[#f2f1ec]" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 hover:bg-transparent"
              asChild
            >
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="icon-link group"
              >
                <FaGithub className="!h-[18px] !w-[18px] sm:!h-[22px] sm:!w-[22px] transition-all duration-200 ease-out group-hover:scale-105 text-gray-900 dark:text-[#f2f1ec] hover:text-gray-900 dark:hover:text-[#f2f1ec]" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 hover:bg-transparent"
              asChild
            >
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="icon-link group"
              >
                <FaLinkedin className="!h-[18px] !w-[18px] sm:!h-[22px] sm:!w-[22px] transition-all duration-200 ease-out group-hover:scale-105 text-gray-900 dark:text-[#f2f1ec] hover:text-gray-900 dark:hover:text-[#f2f1ec]" />
              </a>
            </Button>
          </div>
        </div>

        <section id="education" className="mt-8 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f2f1ec] mb-8">
            Education
          </h2>
          <div className="space-y-3 sm:space-y-6">
            <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.uow.edu.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-white border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="University of Wollongong website"
                >
                  <img
                    src="/logos/uow.png"
                    alt="University of Wollongong logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#f2f1ec]">
                        University of Wollongong
                      </h3>
                      <p className="text-gray-600 dark:text-[#f2f1ec]/80 leading-relaxed">
                        Bachelor of Computer Science, Cyber Security
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#f2f1ec]/60 mt-1 sm:mt-0 whitespace-nowrap">
                      2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f2f1ec] mb-8">
            Experience
          </h2>
          <div className="space-y-3 sm:space-y-6">
            <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.iras.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-white border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="IRAS website"
                >
                  <img
                    src="/logos/iras.png"
                    alt="IRAS logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[#f2f1ec]">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 dark:text-[#f2f1ec]/80 leading-relaxed">
                        Inland Revenue Authority of Singapore (IRAS)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#f2f1ec]/60 mt-1 sm:mt-0 whitespace-nowrap">
                      Jul 2025 – Dec 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.singstat.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-white border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="Singapore Department of Statistics website"
                >
                  <img
                    src="/logos/singstat.png"
                    alt="Singapore Department of Statistics logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[#f2f1ec]">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 dark:text-[#f2f1ec]/80 leading-relaxed">
                        Singapore Department of Statistics (DOS)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#f2f1ec]/60 mt-1 sm:mt-0 whitespace-nowrap">
                      Jan 2025 – Jun 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.htx.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-white border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="HTX website"
                >
                  <img
                    src="/logos/htx.png"
                    alt="HTX logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[#f2f1ec]">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 dark:text-[#f2f1ec]/80 leading-relaxed">
                        Home Team Science & Technology Agency (HTX)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#f2f1ec]/60 mt-1 sm:mt-0 whitespace-nowrap">
                      Apr 2024 – Sep 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.cpf.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-white border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="CPF Board website"
                >
                  <img
                    src="/logos/cpf.png"
                    alt="CPF Board logo"
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[#f2f1ec]">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 dark:text-[#f2f1ec]/80 leading-relaxed">
                        Central Provident Fund Board (CPF Board)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-[#f2f1ec]/60 mt-1 sm:mt-0 whitespace-nowrap">
                      Nov 2023 – Apr 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="writing" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-8 sm:mb-10">
            Writing
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-xl p-4 sm:p-7 max-w-4xl mx-auto shadow-sm">
              {/* Article Header */}
              <div className="mb-5 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f2f1ec] leading-tight mb-1.5 sm:mb-2">
                  One Month with Comet: The AI Browser That Changed How I
                  Research
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-[#f2f1ec]/60 font-medium">
                  October 2025
                </p>
              </div>

              {/* Article Description with Bullet Points */}
              <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                <div className="flex items-start gap-2.5 sm:gap-3 text-gray-700 dark:text-gray-300">
                  <div className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
                  <p className="text-sm sm:text-base leading-relaxed flex-1">
                    My experience using Perplexity's Comet, the AI browser: best
                    features, agentic workflows, and how shortcuts changed my
                    daily browsing.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 sm:gap-3 text-gray-700 dark:text-gray-300">
                  <div className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
                  <p className="text-sm sm:text-base leading-relaxed flex-1">
                    Thoughts on areas for improvement and sample prompts for new
                    users.
                  </p>
                </div>
              </div>

              {/* Article Links */}
              <div className="border-t border-gray-100 dark:border-[#f2f1ec]/20 pt-4 sm:pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:flex-nowrap gap-2.5 sm:gap-6">
                  <a
                    href="https://akileshjayakumar.medium.com/one-month-with-comet-the-ai-browser-that-changed-how-i-research-02933e08bf15"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 dark:text-[#f2f1ec]/80 hover:text-gray-900 dark:hover:text-[#f2f1ec] font-medium text-sm transition-all duration-200 py-2 sm:py-0 -mx-1 px-1 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] sm:hover:bg-transparent"
                  >
                    <FaMedium className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                    <span>Read on Medium</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/feed/update/urn:li:activity:7379780468411461632/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 dark:text-[#f2f1ec]/80 hover:text-gray-900 dark:hover:text-[#f2f1ec] font-medium text-sm transition-all duration-200 py-2 sm:py-0 -mx-1 px-1 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] sm:hover:bg-transparent"
                  >
                    <FaLinkedin className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                    <span>LinkedIn Post</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f5f5f7] mb-8 sm:mb-10">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-4 md:auto-rows-fr">
            {projects.map((project, index) => {
              return (
                <div
                  key={project.id}
                  className="project-card bg-white dark:bg-[#171717] h-full border border-gray-200 dark:border-[#f2f1ec]/20 rounded-xl p-5 sm:p-6 flex flex-col shadow-sm"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Header: Icon + Title + Status Badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${project.iconBg} border border-gray-200 dark:border-[#f2f1ec]/20 flex items-center justify-center leading-none text-3xl sm:text-4xl shadow-sm select-none`}
                      aria-hidden="true"
                    >
                      <span className="flex items-center justify-center w-full h-full">
                        {project.icon.startsWith("/") ? (
                          <img
                            src={project.icon}
                            alt={`${project.title} logo`}
                            className="w-11 h-11 sm:w-13 sm:h-13 object-contain"
                          />
                        ) : (
                          project.icon
                        )}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f2f1ec] leading-tight">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#f2f1ec]/80 border border-gray-200 dark:border-[#f2f1ec]/10">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description - Two bullet points */}
                  <div className="flex-1 mb-6">
                    {project.description &&
                    Array.isArray(project.description) ? (
                      <div className="space-y-2">
                        {project.description.map((point, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-gray-600 dark:text-[#f2f1ec]/70"
                          >
                            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500 flex-shrink-0" />
                            <p className="text-sm sm:text-base leading-relaxed">
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base text-gray-600 dark:text-[#f2f1ec]/70 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Tech Stack - Compact at bottom */}
                  {project.tech && (
                    <div className="mb-6 pt-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-[#f2f1ec]/50 uppercase tracking-wider mb-3">
                        Built with
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Common Tools */}
                        {renderTechLogo(
                          project.tech.includes("Next.js"),
                          "https://nextjs.org/",
                          "Next.js",
                          <SiNextdotjs className="w-4 h-4 text-black" />
                        )}
                        {(project.tech.includes("Vercel") ||
                          project.tech.includes("Vercel AI SDK")) &&
                          renderTechLogo(
                            true,
                            project.tech.includes("Vercel AI SDK")
                              ? "https://sdk.vercel.ai/"
                              : "https://vercel.com/",
                            project.tech.includes("Vercel AI SDK")
                              ? "Vercel AI SDK"
                              : "Vercel",
                            <SiVercel className="w-4 h-4 text-black" />
                          )}
                        {renderTechLogo(
                          project.tech.includes("TypeScript"),
                          "https://www.typescriptlang.org/",
                          "TypeScript",
                          <SiTypescript className="w-4 h-4 text-blue-600" />
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("Tailwind CSS"),
                          "https://tailwindcss.com/",
                          "Tailwind CSS",
                          "https://tailwindcss.com/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=tailwindcss.com"
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("OpenAI"),
                          "https://openai.com/",
                          "OpenAI",
                          "https://openai.com/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=openai.com"
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("Docker"),
                          "https://www.docker.com/",
                          "Docker",
                          "https://www.docker.com/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=docker.com"
                        )}
                        {renderTechLogo(
                          project.tech.includes("LangChain"),
                          "https://www.langchain.com/",
                          "LangChain",
                          <SiLangchain className="w-4 h-4 text-[#1C3C3C]" />
                        )}
                        {(project.tech.includes("AWS Elastic Beanstalk") ||
                          project.tech.includes("AWS Amplify") ||
                          project.tech.includes("AWS S3") ||
                          project.tech.includes("AWS RDS")) &&
                          renderTechLogoImage(
                            true,
                            "https://aws.amazon.com/",
                            "AWS",
                            "https://aws.amazon.com/favicon.ico",
                            "https://www.google.com/s2/favicons?sz=64&domain=aws.amazon.com"
                          )}
                        {(project.tech.includes("Perplexity Spaces") ||
                          project.tech.includes("Perplexity API")) &&
                          renderTechLogo(
                            true,
                            project.tech.includes("Perplexity API")
                              ? "https://docs.perplexity.ai/"
                              : "https://www.perplexity.ai/",
                            "Perplexity",
                            <SiPerplexity className="w-4 h-4 text-[#20808D]" />
                          )}
                        {renderTechLogo(
                          project.tech.includes("Supabase"),
                          "https://supabase.com/",
                          "Supabase",
                          <SiSupabase className="w-4 h-4 text-green-600" />
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("Streamlit"),
                          "https://docs.streamlit.io/",
                          "Streamlit",
                          "https://docs.streamlit.io/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=streamlit.io"
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("NVIDIA NIM"),
                          "https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/",
                          "NVIDIA NIM",
                          "https://www.nvidia.com/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=nvidia.com"
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("LlamaIndex"),
                          "https://www.llamaindex.ai/",
                          "LlamaIndex",
                          "https://cdn.brandfetch.io/id6a4s3gXI/w/400/h/400/theme/dark/icon.png",
                          "https://www.llamaindex.ai/favicon.ico"
                        )}

                        {/* Project-Specific Tools */}
                        {renderTechLogoImage(
                          project.tech.includes("TLDraw"),
                          "https://tldraw.dev/",
                          "TLDraw",
                          "https://tldraw.dev/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=tldraw.dev"
                        )}
                        {renderTechLogoImage(
                          project.tech.includes("Fal.AI"),
                          "https://fal.ai/",
                          "Fal.AI",
                          "https://fal.ai/favicon.ico",
                          "https://www.google.com/s2/favicons?sz=64&domain=fal.ai"
                        )}
                        {(project.tech.includes("Google DeepMind") ||
                          project.tech.includes("Google Gemini & Veo 3.1")) &&
                          renderTechLogoImage(
                            true,
                            "https://deepmind.google/",
                            "Google DeepMind",
                            "https://www.google.com/s2/favicons?sz=64&domain=deepmind.google",
                            "https://deepmind.google/favicon.ico"
                          )}
                        {(project.tech.includes("Google Gemini 3 Flash") ||
                          project.tech.includes("Google Gemini")) &&
                          renderTechLogoImage(
                            true,
                            "https://ai.google.dev/",
                            "Google Gemini",
                            "/gemini-icon.svg",
                            "https://www.google.com/s2/favicons?sz=64&domain=deepmind.google"
                          )}
                        {(project.tech.includes("Groq") ||
                          project.tech.includes("Groq AI Inference")) &&
                          renderTechLogoImage(
                            true,
                            "https://groq.com/",
                            "Groq",
                            "https://groq.com/favicon.ico",
                            "https://www.google.com/s2/favicons?sz=64&domain=groq.com"
                          )}
                        {renderTechLogoImage(
                          project.tech.includes("Google Antigravity"),
                          "https://antigravity.google/",
                          "Google Antigravity",
                          "/antigravity-icon.png",
                          "https://antigravity.google/"
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Links - All styled as buttons */}
                  <div className="border-t border-gray-200 dark:border-[#f2f1ec]/10 pt-5 mt-auto flex-shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gray-900 dark:bg-[#f2f1ec] text-white dark:text-gray-900 text-xs font-medium hover:bg-gray-700 dark:hover:bg-white transition-colors duration-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Try it</span>
                      </a>
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#f2f1ec]/10 text-gray-700 dark:text-[#f2f1ec]/80 text-xs font-medium hover:bg-gray-200 dark:hover:bg-[#f2f1ec]/20 border border-gray-200 dark:border-[#f2f1ec]/20 transition-colors duration-200"
                      >
                        <FaGithub className="w-3 h-3" />
                        <span>Code</span>
                      </a>
                      {project.links.marketing && (
                        <a
                          href={project.links.marketing}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#f2f1ec]/10 text-gray-700 dark:text-[#f2f1ec]/80 text-xs font-medium hover:bg-gray-200 dark:hover:bg-[#f2f1ec]/20 border border-gray-200 dark:border-[#f2f1ec]/20 transition-colors duration-200"
                        >
                          {project.links.marketingLabel === "LinkedIn Post" ? (
                            <FaLinkedin className="w-3.5 h-3.5" />
                          ) : project.links.marketingLabel === "X Post" ||
                            project.links.marketingLabel ===
                              "X/Twitter Post" ? (
                            <FaXTwitter className="w-3.5 h-3.5" />
                          ) : (
                            <Globe className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {project.links.marketingLabel ===
                            "Marketing Website"
                              ? "Marketing Website"
                              : "Post"}
                          </span>
                        </a>
                      )}
                      {project.links.event && (
                        <a
                          href={project.links.event}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#f2f1ec]/10 text-gray-700 dark:text-[#f2f1ec]/80 text-xs font-medium hover:bg-gray-200 dark:hover:bg-[#f2f1ec]/20 border border-gray-200 dark:border-[#f2f1ec]/20 transition-colors duration-200"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Event</span>
                        </a>
                      )}
                    </div>
                    {project.date && (
                      <p className="text-xs text-gray-500 mt-4 sm:mt-3 pt-2 sm:pt-0">
                        {project.date}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-[#f2f1ec] mb-8">
            Contact
          </h2>
          <div className="bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#f2f1ec]/20 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto shadow-sm">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <a
                href="mailto:akilesh.work@icloud.com"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-600 dark:text-[#f2f1ec]/70 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700 dark:text-[#f2f1ec]/80">
                  akilesh.work@icloud.com
                </span>
              </a>
              <a
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
              >
                <FaXTwitter className="h-5 w-5 text-gray-600 dark:text-[#f2f1ec]/70 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700 dark:text-[#f2f1ec]/80">
                  x/twitter
                </span>
              </a>
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
              >
                <FaGithub className="h-5 w-5 text-gray-600 dark:text-[#f2f1ec]/70 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700 dark:text-[#f2f1ec]/80">
                  github
                </span>
              </a>
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
              >
                <FaLinkedin className="h-5 w-5 text-gray-600 dark:text-[#f2f1ec]/70 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700 dark:text-[#f2f1ec]/80">
                  linkedin
                </span>
              </a>
              <a
                href="https://medium.com/@akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
              >
                <FaMedium className="h-5 w-5 text-gray-600 dark:text-[#f2f1ec]/70 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700 dark:text-[#f2f1ec]/80">
                  medium
                </span>
              </a>
              <a
                href="/cv"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-[#242424] transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600 dark:text-[#f2f1ec]/70 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700 dark:text-[#f2f1ec]/80">
                  resume
                </span>
              </a>
            </div>
          </div>
        </section>
        <footer className="w-full mt-12 sm:mt-16 border-t border-gray-200 dark:border-[#f2f1ec]/20 bg-transparent py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Two-column footer grid */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left: Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-gray-600 dark:text-[#f2f1ec]/80">
                  © 2026 Akilesh Jayakumar
                </p>
              </div>

              {/* Right: Built with */}
              <div className="text-center sm:text-right">
                <h3 className="text-xs font-medium tracking-wider text-gray-400 dark:text-[#f2f1ec]/50 mb-3">
                  portfolio built with
                </h3>
                {/* Mobile: Show labels | Desktop: Icons with labels and dots */}
                <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-3">
                  <a
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#f2f1ec]/60 hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors"
                  >
                    <SiNextdotjs className="h-4 w-4" />
                    <span>Next.js</span>
                  </a>
                  <span className="hidden sm:inline text-gray-300 dark:text-[#f2f1ec]/20">
                    ·
                  </span>
                  <a
                    href="https://vercel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#f2f1ec]/60 hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors"
                  >
                    <SiVercel className="h-4 w-4" />
                    <span>Vercel</span>
                  </a>
                  <span className="hidden sm:inline text-gray-300 dark:text-[#f2f1ec]/20">
                    ·
                  </span>
                  <a
                    href="https://groq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-xs text-gray-500 dark:text-[#f2f1ec]/60 hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors"
                  >
                    <img
                      src="https://groq.com/favicon.ico"
                      alt="Groq"
                      className="h-4 w-4 object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://www.google.com/s2/favicons?sz=64&domain=groq.com";
                      }}
                    />
                    <span>Groq</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
