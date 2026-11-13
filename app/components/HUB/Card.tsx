"use client";

import Link from "next/link";
import React from "react";
import styles from "../../styles/HUB/cards/card.module.css";
import TranslateAnimation from "../TranslateAnimation";

interface CardProps {
    title: string;
    icon: string;
    description: string;
    href: string;
}

export default function Card({ title, icon, description, href }: CardProps) {
    return (
        <Link href={href} className={styles.card}>
        <div className={styles.cardIcon}>
            <img src={icon} alt="" />
        </div>
        <h2 className={styles.cardTitle}><TranslateAnimation text={title}/></h2> 
        </Link>
    );
}