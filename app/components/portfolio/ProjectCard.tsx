"use client";

import React, { FC, useEffect, ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation,Pagination,} from 'swiper/modules';
import { Github, SquareTerminal  } from "lucide-react";
import TranslateAnimation from "../TranslateAnimation";
import { useTranslation } from "react-i18next";

export interface ProjectCardProps {
  images: string[];
  title: string;
  description: string;
  technologies: string[];
  detailsUrl?: string;
  sourceUrl?: string;
}

interface IconButtonLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
}

export const IconButtonLink: FC<IconButtonLinkProps> = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full hover:cursor-pointer"
  >
    <button
      type="button"
      className="
        inline-flex items-center justify-center
        appearance-none select-none whitespace-nowrap no-underline
        text-[1.3rem] font-semibold leading-[1.25rem]
        text-[#a56fd8] bg-[#9333ea33]
        px-4 h-[2.5rem]
        w-full
        gap-3
        rounded-[0.7rem]
        transition-opacity hover:opacity-80 active:opacity-50 cursor-pointer
        focus:outline-none focus:z-10 focus:outline-2 focus:outline-offset-2 focus:outline-primary
      "
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  </a>
);

export const TechPills: FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2 items-center pl-8 pr-8 pt-3">
    <span className="text-xl font-extrabold mb-1 text-left text-[#d4d4d4]">Technologies:</span>
    {items.map((tech) => (
      <span
        key={tech}
        className="
      inline-flex items-center px-2 h-6
      text-xs font-normal
      border-2 border-gray-700
      bg-[#27272A] text-gray-100
      rounded-full
      whitespace-nowrap
        "
      >
        {tech}
      </span>
    ))}
  </div>
);

export const ProjectCard: FC<ProjectCardProps> = ({
  images,
  title,
  description,
  technologies,
  detailsUrl,
  sourceUrl,
}) => {

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const { t } = useTranslation("common");
  
  return (
    <>
    <div  className="w-full max-w-sm mx-auto max-w-full bg-[#18181be1] rounded-2xl shadow-lg border-2 border-[#3E304F] min-h-[24rem] lg:min-h-[600px] shadow-[0px_0px_50px_9px_rgba(147,51,234,0.5)] flex flex-col justify-between overflow-hidden">
      <div className="w-full p-8">
        <Swiper 
          modules={[Navigation, Pagination]}
          navigation={true}
          rewind={true}
          pagination= {{dynamicBullets: true, clickable: true}}
          observer={true}
          observeParents={true}
          className="object-cover w-full rounded-2xl"
          style={{
          "--swiper-navigation-color": "#BB86FC",
          "--swiper-pagination-color": "#BB86FC",
          "--swiper-pagination-bullet-inactive-color": "#BB86FC"
        } as React.CSSProperties}
          >
            
          {images.map((src, i) => (
            <SwiperSlide key={i} className="w-full">
              <img
                src={src}
                alt={`${title} : capture ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <h2 className="text-3xl font-extrabold mb-1 text-left text-[#d4d4d4] pl-8">{title}</h2>
      <p className="text-secondaryText pl-8 pr-8 pt-2 mb-1 text-[#a1a1aa] text-left">
        <TranslateAnimation text={t(description)} />
      </p>
      <TechPills items={technologies} />

      <div className="pl-8 pr-8 pt-4">
        <hr className="border-t border-[#2e2e31] my-0 mx-auto h-px" role="separator" />
      </div>

      {(detailsUrl || sourceUrl) && (
        <div className="p-3 px-8 h-auto flex w-full items-center text-current subpixel-antialiased rounded-b-lg gap-x-3">
          {detailsUrl && (
            <IconButtonLink
              href={detailsUrl}
              label="Details"
              icon={<SquareTerminal className="w-5 h-5 text-[#a56fd8]" />}
            />
          )}
          {sourceUrl && (
            <IconButtonLink
              href={sourceUrl}
              label="Source"
              icon={<Github className="w-5 h-5 text-[#a56fd8]" />}
            />
          )}
        </div>
      )}
      </div>
    </>
  );
};
