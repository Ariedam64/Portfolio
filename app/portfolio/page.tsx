"use client";

import React from "react";
import styles from "../styles/portfolio/portfolio.module.css"
import About from "../components/portfolio/About"
import Experiences from "../components/portfolio/Experiences"
import Skills from "../components/portfolio/Skills"
import Projects from "../components/portfolio/Projects"
import Background from "../components/portfolio/Background"


export default function Portfolio() {

  return (
    <>
      <div className="pt-20 lg:pt-16">
        <Background/>
        <section className=" flex flex-col justify-start items-center text-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 lg:max-w-6xl lg:mx-auto"
        id="section-about">
          <About/>
        </section>
        <section className=" flex flex-col justify-start items-center text-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 lg:max-w-6xl lg:mx-auto"  id="section-career">
          <Experiences/>
        </section>
        <section className=" flex flex-col justify-start items-center text-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 lg:max-w-6xl lg:mx-auto"  id="section-skills">
          <Skills/>
        </section>
        <section className=" flex flex-col justify-start items-center text-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 lg:max-w-6xl lg:mx-auto"  id="section-projects">
          <Projects/>
        </section>
      </div>
    </>

  );
}
