export interface SkillData {
  key: string;
  icon: string;
  titleKey: string;
  descriptionKey: string;
}

export const skillsData: SkillData[] = [
  // 0 - HTML / CSS
  {
    key: "html",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    titleKey: "portfolio.skills.0.title",
    descriptionKey: "portfolio.skills.0.desc",
  },
  // 1 - JavaScript
  {
    key: "javascript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg",
    titleKey: "portfolio.skills.1.title",
    descriptionKey: "portfolio.skills.1.desc",
  },
  // 2 - React.js
  {
    key: "reactjs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    titleKey: "portfolio.skills.2.title",
    descriptionKey: "portfolio.skills.2.desc",
  },
  // 3 - Next.js
  {
    key: "nextjs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    titleKey: "portfolio.skills.3.title",
    descriptionKey: "portfolio.skills.3.desc",
  },
  // 4 - Node.js
  {
    key: "nodejs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    titleKey: "portfolio.skills.4.title",
    descriptionKey: "portfolio.skills.4.desc",
  },
  // 5 - Python
  {
    key: "python",
    icon: "/img/python.png",
    titleKey: "portfolio.skills.5.title",
    descriptionKey: "portfolio.skills.5.desc",
  },
  // 6 - C#
  {
    key: "csharp",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    titleKey: "portfolio.skills.6.title",
    descriptionKey: "portfolio.skills.6.desc",
  },
  // 7 - Tampermonkey
  {
    key: "tampermonkey",
    icon: "/img/tampermonkey.webp",
    titleKey: "portfolio.skills.7.title",
    descriptionKey: "portfolio.skills.7.desc",
  },
  // 8 - dnSpy
  {
    key: "dnSpy",
    icon: "/img/dnSpy.webp",
    titleKey: "portfolio.skills.8.title",
    descriptionKey: "portfolio.skills.8.desc",
  },
  // 9 - PostgreSQL
  {
    key: "postgresql",
    icon: "/img/postgresql.png",
    titleKey: "portfolio.skills.9.title",
    descriptionKey: "portfolio.skills.9.desc",
  },
];
