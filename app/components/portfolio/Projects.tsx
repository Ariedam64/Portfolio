"use client";

import React from "react";
import styles from "../../styles/portfolio/portfolio.module.css";
import { useTranslation } from "react-i18next";
import TranslateAnimation from "../TranslateAnimation";
import { ProjectCard } from "../portfolio/ProjectCard";

// Imports statiques : Next connaît la taille de chaque capture et les sert redimensionnées.
import img_ariesmod1 from "@/public/img/ariesmod1.webp";
import img_ariesmod2 from "@/public/img/ariesmod2.webp";
import img_ariesmod3 from "@/public/img/ariesmod3.webp";
import img_ariesmod4 from "@/public/img/ariesmod4.webp";
import img_ariesmod5 from "@/public/img/ariesmod5.webp";
import img_ariesmod6 from "@/public/img/ariesmod6.webp";
import img_frida1 from "@/public/img/frida1.webp";
import img_frida2 from "@/public/img/frida2.webp";
import img_dofus1 from "@/public/img/dofus1.webp";
import img_snapchat2 from "@/public/img/snapchat2.webp";
import img_snapchat1 from "@/public/img/snapchat1.webp";
import img_mayaya_python1 from "@/public/img/mayaya_python1.webp";
import img_mayaya_node1 from "@/public/img/mayaya_node1.webp";
import img_mayaya_overlay3 from "@/public/img/mayaya_overlay3.webp";
import img_mayaya_python5 from "@/public/img/mayaya_python5.webp";
import img_arie1 from "@/public/img/arie1.webp";
import img_arie2 from "@/public/img/arie2.webp";
import img_arie3 from "@/public/img/arie3.webp";
import img_arie4 from "@/public/img/arie4.webp";
import img_arie5 from "@/public/img/arie5.webp";

export default function Projects() {
  const { t } = useTranslation("common");

  const projects = [
  {
    images: [img_ariesmod1, img_ariesmod2, img_ariesmod3, img_ariesmod4, img_ariesmod5, img_ariesmod6],
    title: t("portfolio.projects.ariesmod.title"),
    description: t("portfolio.projects.ariesmod.description"),
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'SQLite', 'Kotlin', 'Claude Code', 'Tampermonkey'],
    detailsUrl: '/portfolio/projects/ariesmod',
    sourceUrl: 'https://github.com/Ariedam64/MG-AriesMod'
  },
  {
    images: [img_frida1, img_frida2, img_dofus1],
    title: t("portfolio.projects.frida.title"),
    description: t("portfolio.projects.frida.description"),
    technologies: ['TypeScript','Frida','frida-il2cpp-bridge','Node.js'],
    detailsUrl: '/portfolio/projects/frida',
    sourceUrl: 'https://github.com/Ariedam64/FridaIL2CPPToolkit'
  },
  {
    images: [img_snapchat2, img_snapchat1],
    title: 'SnapScore+',
    description: t("portfolio.projects.snapscore.description"),
    technologies: ['JavaScript','Node.js','Puppeteer','Tampermonkey','MacroDroid'],
    detailsUrl: '/portfolio/projects/snapscore',
    sourceUrl: 'https://github.com/Ariedam64/SnapScore-V2'
  },
  {
    images: ["/img/mayaya_nodegif.mp4", img_mayaya_python1, img_mayaya_node1, img_mayaya_overlay3, img_mayaya_python5],
    title: 'Mayaya',
    description: t("portfolio.projects.mayaya.description"),
    technologies: ['Node.js', 'JavaScript', 'Python', 'PostgreSQL', 'jQuery', 'Socket.IO','OpenAI API'],
    detailsUrl: '/portfolio/projects/mayaya',
    sourceUrl: 'https://github.com/Ariedam64/Bombparty-Bot'
  },
  {
    images: ["/img/arie.mp4", img_arie1, img_arie2, img_arie3, img_arie4, img_arie5],
    title: 'Arie',
    description: t("portfolio.projects.arie.description"),
    technologies: ['Node.js', 'Discord.js', 'Express', 'PostgreSQL', 'YTDL-Core', 'OpenAI', 'DALL-E', 'Heroku'],
    detailsUrl: '/portfolio/projects/arie',
    sourceUrl: 'https://github.com/Ariedam64/Discord-Bot'
  },
  ];

  return (
    <>
      <p className={styles.projectTitle}>
        <TranslateAnimation text={t("portfolio.navigation.projects")} />
      </p>

      {/* Le projet principal en grand, les autres en grille de deux. */}
      <div className="mt-6 flex w-full max-w-[1100px] flex-col gap-6">
        <ProjectCard {...projects[0]} featured />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.slice(1).map((proj) => (
            <ProjectCard key={proj.detailsUrl} {...proj} />
          ))}
        </div>
      </div>
      <div className="col-span-full h-16" />
    </>
  );
}
