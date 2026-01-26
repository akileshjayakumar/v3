"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

const NOTION_CV_URL =
  "https://akileshjayakumar.notion.site/ebd/24a4893af28a8059ae66e24a8fb95326";

export default function CVPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to site
            </a>
          </Button>
          <Button asChild>
            <a href={NOTION_CV_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" /> Open in Notion
            </a>
          </Button>
        </div>
        <div className="relative w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden border border-gray-200 bg-white dark:bg-[#171717] dark:border-[#f2f1ec]/20">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#171717] z-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-[#f2f1ec]/50 mb-3" />
              <p className="text-sm text-gray-500 dark:text-[#f2f1ec]/60">
                Loading resume...
              </p>
            </div>
          )}
          <iframe
            src={NOTION_CV_URL}
            className="w-full h-full border-0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            title="Akilesh Jayakumar Resume"
          />
        </div>
      </div>
    </div>
  );
}
