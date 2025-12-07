import { Facebook, Linkedin, Mail, Instagram, Globe2 } from "lucide-react";

type SocialType = {
  type: "portfolio" | "facebook" | "linkedin" | "instagram" | "email";
  url: string;
};

type Person = {
  name: string;
  socials: SocialType[];
};

const FOOTER_PEOPLE: Person[] = [
  {
    name: "Hau Tran",
    socials: [
      {
        type: "portfolio",
        url: "https://portfolio-lyart-omega-g63s2g1u72.vercel.app",
      },
      { type: "facebook", url: "https://www.facebook.com/hautrank2" },
      { type: "linkedin", url: "https://www.linkedin.com/in/hautrank2" },
      { type: "instagram", url: "https://www.instagram.com/hautrank2" },
      { type: "email", url: "mailto:hautrantrung.02@gmail.com" },
    ],
  },
];

const SOCIAL_ICON = {
  portfolio: Globe2,
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  email: Mail,
};

export const AppFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
        <div className="flex flex-col gap-8">
          {/* People List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOOTER_PEOPLE.map((person) => (
              <div
                key={person.name}
                className="flex flex-col items-center sm:items-start gap-2"
              >
                <p className="font-semibold text-foreground">{person.name}</p>

                <div className="flex flex-wrap gap-3">
                  {person.socials.map((social) => {
                    const Icon = SOCIAL_ICON[social.type];
                    return (
                      <a
                        key={social.url}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="capitalize">{social.type}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground">
            © {year} • All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
