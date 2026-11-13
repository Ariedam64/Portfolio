"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/translateAnimation.module.css";

interface TranslateAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

/**
 * Affiche un texte traduit, avec un fondu quand il change (changement de
 * langue). Le premier rendu montre directement le texte : il doit être dans le
 * HTML envoyé par le serveur, pour les moteurs de recherche et les aperçus de
 * liens, et ne pas apparaître en retard au chargement.
 */
export default function TranslateAnimation({ text, duration = 300, className = "" }: TranslateAnimationProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const [visible, setVisible] = useState(true);
  const shown = useRef(text);

  useEffect(() => {
    if (text === shown.current) return;
    setVisible(false);
    const timeout = setTimeout(() => {
      shown.current = text;
      setDisplayedText(text);
      setVisible(true);
    }, duration);
    return () => clearTimeout(timeout);
  }, [text, duration]);

  return (
    <span
      className={`${styles.fade} ${visible ? styles.enter : ""} ${className}`}
      style={{ transition: `opacity ${duration}ms ease` }}
    >
      {displayedText}
    </span>
  );
}
