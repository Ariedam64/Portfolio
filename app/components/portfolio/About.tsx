"use client";

import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FiExternalLink } from "react-icons/fi";
import React from "react";
import { useTranslation } from "react-i18next";
import TranslateAnimation from "../TranslateAnimation";

export default function About() {
  const { t, i18n } = useTranslation("common");
  const cvHref =
    i18n.language?.startsWith("fr")
      ? "https://drive.google.com/file/d/1FghnWYWUc9MMw7RnRcA3kyjfD558YtP0/view?usp=sharing"
      : "https://drive.google.com/file/d/15KAJVvx4hJSfPVHfQGfiX6qLlzDN8odQ/view?usp=sharing";

  return (
    <>
        {/* Nom */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          <TranslateAnimation text={t("portfolio.about.name")} />
        </h2>

        {/* Titre / métier */}
        <p className="text-xl md:text-2xl text-gray-300 mb-6">
          <TranslateAnimation text={t("portfolio.about.role")} />
        </p>

        {/* Photo */}
        <span className="relative inline-block group mb-6
                        w-40 h-40 md:w-56 md:h-56">
          <img
            src="/img/avatar.png"
            alt="Avatar"
            className="
              block
              w-full h-full
              rounded-full object-cover

              transition-transform duration-300 ease-out
              group-hover:scale-105
            "
          />
          {/* cercle animé */}
          <span className="
            absolute inset-0
            rounded-full
            border-2 border-purple-600 opacity-75

            transition-all duration-500 ease-out
            group-hover:scale-110 group-hover:opacity-100
            group-hover:animate-pulse

            pointer-events-none
          " />
        </span>

        {/* Description */}
        <p className="max-w-2xl text-center text-base md:text-lg text-gray-300 mb-6">
          <TranslateAnimation text={t("portfolio.about.description")} />
        </p>

        {/* Réseaux sociaux */}
        <div className="flex space-x-6 mb-6">
          <a
            href="https://github.com/Ariedam64"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/romann-madeira-9991a41bb/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:ariedam.romann@gmail.com"
            aria-label="Mail"
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            <FaEnvelope />
          </a>
        </div>

        {/* Bouton CV */}
        <a
          href={cvHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="CV"
          className="inline-flex items-center space-x-3 text-purple-400 bg-purple-600/30 hover:bg-purple-600/40 font-medium px-6 py-3 rounded-full transition-colors mb-10 text-base"
        >
          <TranslateAnimation text={t("portfolio.about.cvLink")} />
          <FiExternalLink size={20} />
        </a>

        {/* Indicateur scroll: toujours sous le bouton CV */}
        <div className="mt-2">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-xl flex items-start justify-center p-1 animate-bounce">
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
            </div>
        </div>
    </>
  );
}
