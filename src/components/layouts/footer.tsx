"use client";

import { Facebook, Linkedin, Mail, Instagram, Globe2 } from "lucide-react";

export const AppFooter = () => {
  // TODO: Điền thông tin thật của bạn vào đây
  const YOUR_NAME = "Hau Tran";
  const FACEBOOK_URL = "https://www.facebook.com/hautrank2";
  const LINKEDIN_URL = "https://www.linkedin.com/in/hautrank2";
  const INSTAGRAM_URL = "https://www.instagram.com/hautrank2";
  const PORTFOLIO_URL = "https://portfolio-lyart-omega-g63s2g1u72.vercel.app";
  const EMAIL = "hautrantrung.02@gmail.com"; // ví dụ: "youremail@gmail.com"

  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground md:flex-row">
        {/* Left: Name + year */}
        <div className="text-center md:text-left">
          <p className="font-medium text-foreground">
            {YOUR_NAME || "Your Name"}
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} • All rights reserved.
          </p>
        </div>

        {/* Right: social links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Portfolio */}
          <a
            href={PORTFOLIO_URL || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Globe2 className="h-4 w-4" />
            <span>Portfolio</span>
          </a>

          {/* Facebook */}
          <a
            href={FACEBOOK_URL || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </a>

          {/* LinkedIn */}
          <a
            href={LINKEDIN_URL || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </a>

          {/* Instagram */}
          <a
            href={INSTAGRAM_URL || "#"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>

          {/* Gmail */}
          <a
            href={EMAIL ? `mailto:${EMAIL}` : "#"}
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Gmail</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
