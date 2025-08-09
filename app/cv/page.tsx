"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

const NOTION_CV_URL =
  "https://akileshjayakumar.notion.site/ebd/24a4893af28a8059ae66e24a8fb95326";

export default function CVPage() {
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
        <div className="w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden border border-gray-200 bg-white">
          <iframe
            src={NOTION_CV_URL}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
