"use client";

import { useTranslation } from "react-i18next";
import HubStyles from "../../styles/HUB/hub.module.css"
import HubCard from "./Card";
import Background from "./Background"
import TranslateAnimation from "../TranslateAnimation";

export default function HubPage() {
  
  const { t } = useTranslation('common');

  return (
     <>
      <Background />
      <div className={HubStyles.hubContent}>
        <div className={HubStyles.hubWrapper}>
          
          <h1 className={HubStyles.heading}>
            <TranslateAnimation text={t('hub.welcome')}/>
          </h1>

          <div className={HubStyles.cardContainer}>

            <HubCard
              title={t('hub.portfolio.title')}
              icon= "/img/i_portfolio.png"
              description={t('hub.portfolio.description')}
              href="/portfolio"
            />
            <HubCard
              title={t('hub.tools.title')} 
              icon= "/img/i_toolbox.png"
              description={t('hub.tools.description')}
              href="/outils"
            />
          </div>
        </div>
      </div>
    </>
  );
}