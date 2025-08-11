"use client";

import { Button } from "@/components/ui/button";
import { Mail, ExternalLink, Globe, Menu, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { FaMedium } from "react-icons/fa";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { FaXTwitter } from "react-icons/fa6";
import React from "react";

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const projects = [
    {
      id: "hawker-helper",
      title: "Hawker Food Menu Helper",
      icon: "🍜",
      iconBg: "bg-green-100",
      description: [
        "Upload a hawker centre menu photo to extract dishes and prices.",
        "Get healthy and value picks, and chat to explore the menu.",
      ],
      status: "EMERGENCY GPT HACKATHON 2025 (August 2025)",
      tech: ["Next.js", "Tailwind CSS", "Groq", "Vercel AI SDK"],
      links: {
        demo: "https://emergency-gpt-hackathon-2025.vercel.app/",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7360651593400135683/",
        github:
          "https://github.com/akileshjayakumar/emergency-gpt-hackathon-2025",
        marketingLabel: "LinkedIn Post",
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
      status: "UOW Final Year Capstone Project (April 2025 - September 2025)",
      tech: [
        "Python",
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
      status: "Side Project (April 2025)",
      tech: ["Perplexity Spaces"],
      links: {
        demo: "https://www.perplexity.ai/spaces/prompttacular-kWSdzdeGRMyTLgnG5NmzFg",
        marketing:
          "https://www.linkedin.com/feed/update/urn:li:activity:7320364815191879680/",
        github: "https://github.com/akileshjayakumar/perplexity-spaces-prompts",
        marketingLabel: "LinkedIn Post",
      },
    },
  ];

  const navItems = [
    { label: "experience", href: "#experience" },
    { label: "projects", href: "#projects" },
    { label: "contact", href: "#contact" },
    { label: "resume", href: "/cv" },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Profile Section */}
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
            {/* Navigation */}
            {/* On desktop, show nav links. On mobile, show hamburger icon. */}
            <nav className="hidden sm:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  onClick={(e) => {
                    if (!item.href.startsWith("#")) return; // let normal navigation happen for /cv
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
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {/* Hamburger for mobile */}
            <div className="sm:hidden absolute top-0 right-0">
              <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-white max-w-xs w-full rounded-lg">
                  <nav className="flex flex-col py-6 px-6 space-y-4">
                    {navItems.map((item) => (
                      <DialogClose asChild key={item.label}>
                        <a
                          href={item.href}
                          className="text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.href.startsWith("#")) {
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
                              setMenuOpen(false);
                            } else {
                              setMenuOpen(false);
                              window.location.href = item.href;
                            }
                          }}
                        >
                          {item.label}
                        </a>
                      </DialogClose>
                    ))}
                  </nav>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Akilesh Jayakumar
            </h1>
            <p className="text-gray-700 leading-relaxed mt-2 mb-6 text-base sm:text-lg">
              exploring genai, llms & agents
            </p>
          </div>
          {/* Social Links */}
          <div className="flex items-center space-x-4 sm:space-x-5 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 hover:translate-y-0 active:scale-100"
              asChild
            >
              <a
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="icon-link"
              >
                <FaXTwitter className="h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 hover:text-gray-900" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 hover:translate-y-0 active:scale-100"
              asChild
            >
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="icon-link"
              >
                <FaGithub className="h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 hover:text-gray-900" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 hover:translate-y-0 active:scale-100"
              asChild
            >
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="icon-link"
              >
                <FaLinkedin className="h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200 hover:text-gray-900" />
              </a>
            </Button>
          </div>
        </div>

        {/* Experience Section */}
        <section id="experience" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8">
            Experience
          </h2>
          <div className="space-y-3 sm:space-y-6">
            {/* Each experience card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <a
                  href="https://www.iras.gov.sg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="IRAS website"
                >
                  <img
                    src="/logos/iras.png"
                    alt="IRAS logo"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      // @ts-ignore
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        Software Engineer Intern
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Inland Revenue Authority of Singapore (IRAS)
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
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
                  className="group w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="Singapore Department of Statistics website"
                >
                  <img
                    src="/logos/singstat.png"
                    alt="Singapore Department of Statistics logo"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      // @ts-ignore
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        AI Engineer Intern
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
                  className="group w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="HTX website"
                >
                  <img
                    src="/logos/htx.png"
                    alt="HTX logo"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      // @ts-ignore
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        AI Engineer Intern
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
                  className="group w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ease-out hover:shadow-md"
                  aria-label="CPF Board website"
                >
                  <img
                    src="/logos/cpf.png"
                    alt="CPF Board logo"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
                    onError={(e) => {
                      // @ts-ignore
                      e.currentTarget.src = "/placeholder-logo.png";
                    }}
                  />
                </a>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        AI Engineer Intern
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

        {/* Projects Section */}
        <section id="projects" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8">
            Projects
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto flex flex-col gap-6"
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`flex-shrink-0 w-14 h-14 rounded-xl ${project.iconBg} flex items-center justify-center text-3xl`}
                  >
                    {project.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    {project.description &&
                    Array.isArray(project.description) ? (
                      <ul className="text-gray-700 text-base space-y-2 mb-3">
                        {project.description.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 leading-relaxed"
                          >
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 mb-2 text-base leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    <div className="italic text-gray-500 text-sm mb-2">
                      {project.status}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tech &&
                    project.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
                <div className="flex gap-4 sm:gap-6 pt-2 border-t border-gray-100">
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-gray-800 hover:text-gray-900 font-medium text-xs sm:text-sm md:text-base"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    Demo
                  </a>
                  <a
                    href={project.links.marketing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-gray-800 hover:text-gray-900 font-medium text-xs sm:text-sm md:text-base"
                  >
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    {project.links.marketingLabel ?? "Website"}
                  </a>
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-gray-800 hover:text-gray-900 font-medium text-xs sm:text-sm md:text-base"
                  >
                    <FaGithub className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    Source Code
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-16 sm:mt-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8">
            Contact
          </h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto shadow-sm">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <a
                href="mailto:jayakuma006@mymail.sim.edu.sg"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">
                  jayakuma006@mymail.sim.edu.sg
                </span>
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
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaLinkedin className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">linkedin</span>
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
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FaXTwitter className="h-5 w-5 text-gray-600 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="text-gray-700">x</span>
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
        {/* Footer */}
        <footer className="w-full py-6 sm:py-8 flex flex-col items-center justify-center bg-transparent mt-8 sm:mt-12">
          <a
            href="https://github.com/akileshjayakumar?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors mb-4"
          >
            <FaGithub className="h-6 w-6 mr-2 inline-block" />
            <span className="text-base sm:text-lg font-medium">
              more projects on my github!
            </span>
          </a>
          <span className="text-base sm:text-xl text-gray-400">
            &copy; 2025 akilesh jayakumar
          </span>
        </footer>
      </div>
    </div>
  );
}
