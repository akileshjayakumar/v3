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
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
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
} from "react-icons/si";
import { FaMedium } from "react-icons/fa";
import Image from "next/image";

import AnimatedChatButton from "@/components/animated-chat-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
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
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

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
        className="inline-flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-out group border border-gray-200"
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
        className="inline-flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-white hover:bg-gray-50 transition-all duration-300 ease-out group border border-gray-200"
        aria-label={label}
      >
        <img
          src={src}
          alt={label}
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
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

  // Carousel state management
  React.useEffect(() => {
    if (!api) {
      return;
    }

    // Ensure carousel starts at index 0 (DoodleMorph)
    api.scrollTo(0, false);
    setCurrent(0);

    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      const projectCount = projects.length;

      // Normalize index to handle loop mode
      let normalizedIndex = selectedIndex % projectCount;
      if (normalizedIndex < 0) {
        normalizedIndex = projectCount + normalizedIndex;
      }

      // If we're at a clone slide, jump to the real slide
      if (selectedIndex >= projectCount || selectedIndex < 0) {
        api.scrollTo(normalizedIndex, true);
        setCurrent(normalizedIndex);
        return;
      }

      setCurrent(normalizedIndex);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Custom scroll handlers for infinite loop
  const handleScrollNext = () => {
    if (!api) return;
    const currentIndex = api.selectedScrollSnap();
    const projectCount = projects.length;

    if (currentIndex === projectCount - 1) {
      // At last slide, loop to first
      api.scrollTo(0, false);
    } else {
      // Normal next
      api.scrollNext();
    }
  };

  const handleScrollPrev = () => {
    if (!api) return;
    const currentIndex = api.selectedScrollSnap();
    const projectCount = projects.length;

    if (currentIndex === 0) {
      // At first slide, loop to last
      api.scrollTo(projectCount - 1, false);
    } else {
      // Normal prev
      api.scrollPrev();
    }
  };

  const projects = [
    {
      id: "doodlemorph",
      title: "DoodleMorph",
      icon: "🎨",
      iconBg: "bg-orange-100",
      description: [
        "Built an app that transforms your doodles/sketches into creative images, character designs, and cinematic animations.",
        "Used fal for media generation and Groq for fast prompt enhancements.",
      ],
      date: "October 2025",
      status: "Cursor Hackathon Singapore 2025",
      tech: [
        "Next.js",
        "Vercel",
        "TLDraw",
        "Fal.AI",
        "Google DeepMind",
        "Groq",
      ],
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
      iconBg: "bg-green-100",
      description: [
        "Upload a hawker centre menu photo to extract all dishes and prices.",
        "Get healthy and value picks, and chat to explore the menu.",
      ],
      date: "August 2025",
      status: "EMERGENCY GPT HACKATHON 2025",
      tech: ["Next.js", "Tailwind CSS", "Groq", "Vercel AI SDK"],
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
      iconBg: "bg-purple-100",
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
      iconBg: "bg-pink-100",
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
      iconBg: "bg-blue-100",
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
    const iconProps = { className: "h-6 w-6 text-gray-800" };
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
      {/* Fixed Desktop Icon Navigation Sidebar */}
      <TooltipProvider>
        <nav className="hidden sm:flex fixed left-4 top-1/2 -translate-y-1/2 z-40">
          <div className="flex flex-col space-y-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-4 border border-gray-200/50 shadow-lg">
            {navItems.filter((item) => item.label !== "chat").map((item) => {
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
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>
                    <a
                      href={item.href}
                      onClick={handleClick}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                      aria-label={item.label}
                    >
                      {getNavIcon(item.label)}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    <p className="capitalize">{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>
      </TooltipProvider>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 sm:pl-14">
        <div className="mb-12 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200">
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
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors chat-button-animated px-3 py-2 rounded-md flex items-center"
              >
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 chat-icon-bounce" />
                  {chatItem.label}
                </span>
              </AnimatedChatButton>
            </nav>
            
            <div className="sm:hidden absolute top-0 right-0">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                onClick={handleOpenMenu}
                className="h-12 w-12 hover:bg-gray-100"
              >
                <Menu className="h-8 w-8 font-bold" strokeWidth={2.5} />
              </Button>

              {(menuOpen || isClosing) && (
                <div className="fixed inset-0 z-50 flex items-start justify-end">
                  <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
                      isClosing ? "opacity-0" : "opacity-100"
                    }`}
                    onClick={handleCloseMenu}
                  />

                  <div
                    className={`relative bg-white w-80 max-w-[90vw] h-full shadow-xl transition-transform duration-300 ease-out ${
                      isClosing
                        ? "translate-x-full"
                        : isOpening
                        ? "translate-x-full"
                        : "translate-x-0"
                    }`}
                  >
                    <button
                      onClick={handleCloseMenu}
                      className="absolute right-4 top-4 z-50 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none bg-white shadow-sm"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6 text-red-500" />
                    </button>

                    <nav className="flex flex-col py-6 px-6 space-y-4 mt-16">
                      {navItems.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          className="text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 py-2"
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
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Akilesh Jayakumar
            </h1>
            <p className="text-gray-700 leading-relaxed mt-2 mb-6 text-base sm:text-lg">
              exploring / experimenting with GenAI & LLMs
            </p>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-5 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11"
              asChild
            >
              <a
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="icon-link group"
              >
                <FaXTwitter className="!h-[18px] !w-[18px] sm:!h-[22px] sm:!w-[22px] transition-all duration-200 ease-out group-hover:scale-105 hover:text-gray-900" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11"
              asChild
            >
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="icon-link group"
              >
                <FaGithub className="!h-[18px] !w-[18px] sm:!h-[22px] sm:!w-[22px] transition-all duration-200 ease-out group-hover:scale-105 hover:text-gray-900" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11"
              asChild
            >
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="icon-link group"
              >
                <FaLinkedin className="!h-[18px] !w-[18px] sm:!h-[22px] sm:!w-[22px] transition-all duration-200 ease-out group-hover:scale-105 hover:text-gray-900" />
              </a>
            </Button>
          </div>
        </div>

        <section id="education" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8">
            Education
          </h2>
          <div className="space-y-3 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.uow.edu.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
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
                      <h3 className="text-lg font-semibold text-gray-900">
                        University of Wollongong
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Bachelor of Computer Science, Cyber Security
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                      June 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8">
            Experience
          </h2>
          <div className="space-y-3 sm:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.iras.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
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
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Inland Revenue Authority of Singapore (IRAS)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                      Jul 2025 – Present
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.singstat.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
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
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Singapore Department of Statistics (DOS)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                      Jan 2025 – Jun 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.htx.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
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
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Home Team Science & Technology Agency (HTX)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                      Apr 2024 – Sep 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <a
                  href="https://www.cpf.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 sm:w-14 sm:h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
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
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Intern, AI Engineer
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Central Provident Fund Board (CPF Board)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                      Nov 2023 – Apr 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="writing" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8 sm:mb-10">
            Writings
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-7 max-w-4xl mx-auto shadow-sm">
              {/* Article Header */}
              <div className="mb-5 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-1.5 sm:mb-2">
                  One Month with Comet: The AI Browser That Changed How I
                  Research
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  October 2025
                </p>
              </div>

              {/* Article Description with Bullet Points */}
              <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                <div className="flex items-start gap-2.5 sm:gap-3 text-gray-700">
                  <div className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-400 flex-shrink-0" />
                  <p className="text-sm sm:text-base leading-relaxed flex-1">
                    My experience using Perplexity's Comet, the AI browser: best
                    features, agentic workflows, and how shortcuts changed my
                    daily browsing.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 sm:gap-3 text-gray-700">
                  <div className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-gray-400 flex-shrink-0" />
                  <p className="text-sm sm:text-base leading-relaxed flex-1">
                    Thoughts on areas for improvement and sample prompts for new
                    users.
                  </p>
                </div>
              </div>

              {/* Article Links */}
              <div className="border-t border-gray-100 pt-4 sm:pt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:flex-nowrap gap-2.5 sm:gap-5 sm:gap-6">
                  <a
                    href="https://akileshjayakumar.medium.com/one-month-with-comet-the-ai-browser-that-changed-how-i-research-02933e08bf15"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-sm transition-all duration-200 py-2 sm:py-0 -mx-1 px-1 rounded-md hover:bg-gray-50 sm:hover:bg-transparent"
                  >
                    <FaMedium className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                    <span>Read on Medium</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/feed/update/urn:li:activity:7379780468411461632/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-sm transition-all duration-200 py-2 sm:py-0 -mx-1 px-1 rounded-md hover:bg-gray-50 sm:hover:bg-transparent"
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
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8 sm:mb-10">
            Projects
          </h2>
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full max-w-4xl mx-auto relative"
          >
            <CarouselContent>
              {projects.map((project, index) => {
                return (
                  <CarouselItem
                    key={project.id}
                    className="basis-full carousel-slide"
                  >
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 w-full max-w-4xl mx-auto min-w-0 h-[750px] sm:h-[550px] flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      {/* Icon and Title Section */}
                      <div className="flex flex-col sm:flex-row items-start gap-5 mb-4">
                        <div
                          className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center leading-none text-2xl sm:text-3xl shadow-sm select-none"
                          aria-hidden="true"
                        >
                          <span className="flex items-center justify-center w-full h-full">
                            {project.icon}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 break-words">
                            {project.title}
                          </h3>
                          {project.date && (
                            <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1.5 break-words">
                              {project.date}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 font-medium break-words">
                            {project.status}
                          </p>
                        </div>
                      </div>

                      {/* Project Description - Bullet Points */}
                      {project.description &&
                      Array.isArray(project.description) ? (
                        <div className="space-y-3 mb-4 flex-1 overflow-y-auto min-h-0">
                          {project.description.map((point, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <div className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                              <p className="text-sm sm:text-base leading-relaxed break-words">
                                {point}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mb-4 flex-1 overflow-y-auto min-h-0">
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                            {project.description}
                          </p>
                        </div>
                      )}

                      {/* Tech Logos */}
                      {project.tech && (
                        <div className="flex items-center gap-1.5 sm:gap-2.5 mb-3 sm:mb-4 flex-wrap flex-shrink-0">
                          {/* Common Tools */}
                          {renderTechLogo(
                            project.tech.includes("Next.js"),
                            "https://nextjs.org/",
                            "Next.js",
                            <SiNextdotjs className="w-4 h-4 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-110 transition-transform duration-300 ease-out" />
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
                              <SiVercel className="w-4 h-4 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-110 transition-transform duration-300 ease-out" />
                            )}
                          {renderTechLogo(
                            project.tech.includes("TypeScript"),
                            "https://www.typescriptlang.org/",
                            "TypeScript",
                            <SiTypescript className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300 ease-out" />
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
                            <SiLangchain className="w-4 h-4 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-110 transition-transform duration-300 ease-out" />
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
                          {renderTechLogo(
                            project.tech.includes("Perplexity Spaces"),
                            "https://www.perplexity.ai/",
                            "Perplexity",
                            <SiPerplexity className="w-4 h-4 sm:w-6 sm:h-6 text-gray-900 group-hover:scale-110 transition-transform duration-300 ease-out" />
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
                            "https://www.google.com/s2/favicons?sz=64&domain=tldraw.dev",
                            { filter: "brightness(0)" }
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
                          {(project.tech.includes("Groq") ||
                            project.tech.includes("Groq AI Inference")) &&
                            renderTechLogoImage(
                              true,
                              "https://groq.com/",
                              "Groq",
                              "https://groq.com/favicon.ico",
                              "https://www.google.com/s2/favicons?sz=64&domain=groq.com"
                            )}
                        </div>
                      )}

                      {/* Project Links */}
                      <div className="border-t border-gray-200 pt-4 mt-auto flex-shrink-0">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-5">
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-xs md:text-sm transition-all duration-200 py-1 sm:py-0"
                          >
                            <ExternalLink className="w-4 h-4 sm:w-3 sm:h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                            <span>Demo</span>
                          </a>
                          {project.links.marketing && (
                            <a
                              href={project.links.marketing}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-xs md:text-sm transition-all duration-200 py-1 sm:py-0"
                            >
                              {project.links.marketingLabel ===
                              "LinkedIn Post" ? (
                                <FaLinkedin className="w-4 h-4 sm:w-3 sm:h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                              ) : (
                                <Globe className="w-4 h-4 sm:w-3 sm:h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                              )}
                              <span>
                                {project.links.marketingLabel ?? "Website"}
                              </span>
                            </a>
                          )}
                          {project.links.event && (
                            <a
                              href={project.links.event}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-xs md:text-sm transition-all duration-200 py-1 sm:py-0"
                            >
                              <Calendar className="w-4 h-4 sm:w-3 sm:h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                              <span className="whitespace-nowrap">Event</span>
                            </a>
                          )}
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 sm:gap-1.5 text-gray-700 hover:text-gray-900 font-medium text-sm sm:text-xs md:text-sm transition-all duration-200 py-1 sm:py-0"
                          >
                            <FaGithub className="w-4 h-4 sm:w-3 sm:h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 flex-shrink-0" />
                            <span>Source Code</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Custom Navigation Buttons with proper icons */}
            <button
              onClick={handleScrollPrev}
              className="carousel-nav-button hidden md:flex absolute -left-12 lg:-left-16 top-1/2 -translate-y-1/2 h-11 w-11 lg:h-12 lg:w-12 rounded-full border-0 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 z-10 backdrop-blur-sm flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={handleScrollNext}
              className="carousel-nav-button hidden md:flex absolute -right-12 lg:-right-16 top-1/2 -translate-y-1/2 h-11 w-11 lg:h-12 lg:w-12 rounded-full border-0 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 z-10 backdrop-blur-sm flex items-center justify-center"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5 text-gray-700" />
            </button>

            {/* Mobile and tablet navigation buttons */}
            <div className="flex justify-center gap-4 mt-8 md:hidden">
              <button
                onClick={handleScrollPrev}
                className="carousel-nav-button relative h-11 w-11 rounded-full border-0 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                aria-label="Previous slide"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handleScrollNext}
                className="carousel-nav-button relative h-11 w-11 rounded-full border-0 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                aria-label="Next slide"
              >
                <ArrowRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </Carousel>
        </section>

        <section id="contact" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8">
            Contact
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto shadow-sm">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <a
                href="mailto:akilesh.work@icloud.com"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">akilesh.work@icloud.com</span>
              </a>
              <a
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaXTwitter className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">x/twitter</span>
              </a>
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaGithub className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">github</span>
              </a>
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaLinkedin className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">linkedin</span>
              </a>
              <a
                href="https://medium.com/@akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaMedium className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">medium</span>
              </a>
              <a
                href="/cv"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">resume</span>
              </a>
            </div>
          </div>
        </section>
        <footer className="w-full mt-12 sm:mt-16 border-t border-gray-200 bg-transparent py-8 sm:py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-6">
              {/* Top Row: Copyright and GitHub Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  &copy; 2025 akilesh jayakumar
                </p>
                <a
                  href="https://github.com/akileshjayakumar?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>more projects on github</span>
                </a>
              </div>

              {/* Bottom Row: Built with section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  built with
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Next.js"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <SiNextdotjs className="h-4 w-4 text-gray-900" />
                  </a>
                  <a
                    href="https://vercel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Vercel"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <SiVercel className="h-4 w-4 text-gray-900" />
                  </a>
                  <a
                    href="https://groq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Groq"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
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
