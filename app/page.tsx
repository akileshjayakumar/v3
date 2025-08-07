"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";

import { FaXTwitter } from "react-icons/fa6";

export default function Portfolio() {
  const projects = [
    {
      id: "deeppurple",
      title: "DeepPurple",
      icon: "🧠",
      iconBg: "bg-purple-100",
      description: [
        "Built a cloud-based multimodal GenAI platform to analyse customer emotions, sentiment, and key topics.",
        "Deployed on AWS with RESTful APIs for automated, scalable analysis tasks across uploaded files and chat data.",
      ],
      status: "UOW Final Year Capstone Project 2025",
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
      },
    },
  ];

  const navItems = [
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                <Image
                  src="/photo.jpg"
                  alt="Akilesh Jayakumar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div></div>
            </div>
            {/* Navigation */}
            <nav className="flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium transition-colors text-gray-500 hover:text-gray-900"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Akilesh Jayakumar
            </h1>
            <p className="text-gray-700 leading-relaxed mt-2 mb-6">
              exploring genai, llms & agents
            </p>
          </div>
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href="https://x.com/sentrytoast"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Experience Section */}
        <section id="experience">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Experience</h2>
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold">IRAS</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Software Engineer Intern
                      </h3>
                      <p className="text-gray-600">
                        Inland Revenue Authority of Singapore (IRAS)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      Jul 2025 – Present
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold">DOS</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        AI Engineer Intern
                      </h3>
                      <p className="text-gray-600">
                        Singapore Department of Statistics (DOS)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      Jan 2025 – Jun 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold">HTX</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        AI Engineer Intern
                      </h3>
                      <p className="text-gray-600">
                        Home Team Science & Technology Agency (HTX)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      Apr 2024 – Sep 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-bold">CPF</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        AI Engineer Intern
                      </h3>
                      <p className="text-gray-600">
                        Central Provident Fund Board (CPF Board)
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      Nov 2023 – Apr 2024
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <br />
        <br />
        <br />
        <section id="projects">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${project.iconBg} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-2xl">{project.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {project.title}
                    </h3>
                    {project.description &&
                    Array.isArray(project.description) ? (
                      <ul className="text-gray-700 mb-2 list-disc list-inside">
                        {project.description.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 mb-2">
                        {project.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 italic mb-3">
                      {project.status}
                    </p>
                    {project.tech && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Demo
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={project.links.marketing}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="mr-2 h-3 w-3" />
                          Website
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="mr-2 h-3 w-3" />
                          Source Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Contact</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="mailto:jayakuma006@mymail.sim.edu.sg"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">jayakuma006@mymail.sim.edu.sg</span>
              </a>
              <a
                href="https://akileshjayakumar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">website</span>
              </a>
              <a
                href="https://linkedin.com/in/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">linkedin</span>
              </a>
              <a
                href="https://github.com/akileshjayakumar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Github className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">github</span>
              </a>
            </div>
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer className="w-full py-8 flex flex-col items-center justify-center bg-transparent mt-12">
        <a
          href="https://github.com/akileshjayakumar?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors mb-4"
        >
          <Github className="h-6 w-6 mr-2 inline-block" />{" "}
          <span className="text-lg font-medium">
            more projects on my github!
          </span>
        </a>
        <span className="text-xl text-gray-400">
          &copy; 2025 akilesh jayakumar
        </span>
      </footer>
    </div>
  );
}
