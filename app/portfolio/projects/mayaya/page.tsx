"use client";

import { useTranslation } from "react-i18next";
import { mayayaModule, ModuleData } from "@/app/data/projectsData"
import Background from "../../../components/portfolio/Background";
import Caroussel from "../../../components/portfolio/Caroussel";
import SectionCard from "@/app/components/portfolio/projects/SectionCard";
import TechPills from "@/app/components/portfolio/projects/TechPills";
import ListSection from "@/app/components/portfolio/projects/ListSection";
import TranslateAnimation from "@/app/components/TranslateAnimation"
import Header from "@/app/components/portfolio/projects/Header";
import Section from "@/app/components/portfolio/projects/Section";
import TreeView from "@/app/components/portfolio/projects/TreeView";
import { tList } from "@/utils/i18n";
import PageLayout from "@/app/components/portfolio/projects/PayeLayout";
import TabsSection, { TabItem } from "@/app/components/portfolio/projects/TabSection"

export default function MayayaProject() {
  const { t } = useTranslation("common");

  const projectTabs: TabItem<ModuleData>[] = mayayaModule.map((m) => ({
    key: m.key,
    label: t(m.labelKey),
    content: m,
  }));

  return (
    <>
      <Background />

      <PageLayout>

        <Header emoji="🐝" title={t("portfolio.projects.mayaya.title")} subtitle={t("portfolio.projects.mayaya.subtitle")}/>

        <Section emoji="🎮" title={t("portfolio.projects.mayaya.game_title")}>
          <TranslateAnimation text={t("portfolio.projects.mayaya.game_desc")} />
        </Section>

        <Section emoji="🚀" title={t("portfolio.projects.mayaya.origin.title")}>
          <p> <TranslateAnimation text={t("portfolio.projects.mayaya.origin.description")} /> </p>
          <p> <TranslateAnimation text={t("portfolio.projects.mayaya.origin.conclusion")} /></p>
        </Section>

        <TabsSection
          title={t("portfolio.sections.architecture")}
          items={projectTabs}
          renderContent={({ content: m }) => {
            const base = `portfolio.projects.mayaya.modules.${m.key}`;
            return (
              <div className="space-y-6 bg-zinc-800/40 p-6 rounded-lg">
                <SectionCard title={t("portfolio.sections.objective")} icon="🎯" borderColor="border-[#9333ea]">
                  <p><TranslateAnimation text={t(m.objectiveKey)} /></p>
                </SectionCard>
                <SectionCard title={t(`${base}.structure_title`)} icon="🗂️" borderColor="border-fuchsia-500">
                  <TreeView treeText={t(`${base}.structure`)} />
                </SectionCard>
                <SectionCard title={t("portfolio.sections.features")} icon="⚙️" borderColor="border-green-500">
                <ListSection items={tList(t, m.featuresKey) as string[]} textColor="text-gray-300"/>
              </SectionCard>
              <SectionCard title={t("portfolio.sections.limits")} icon="❌" borderColor="border-red-500">
                <ListSection items={tList(t, m.limitsKey) as string[]} textColor="text-gray-300"/>
              </SectionCard>
              <TechPills items={tList(t, m.techKey) as string[]} />
              <Caroussel className="mx-auto" images={m.images} />
              {m.repoUrl && (
                <div className="flex justify-center">
                  <a href={m.repoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                    <TranslateAnimation text={t("portfolio.sections.viewCode")} />
                  </a>
                </div>
              )}
            </div>
            );
          }}
        />

        <Section emoji="🎲" title={t("portfolio.projects.mayaya.funFact.title")}>
          <p className="text-gray-200"><TranslateAnimation text={t("portfolio.projects.mayaya.funFact.intro")}/></p>
          <div>
            <ListSection items={tList(t, "portfolio.projects.mayaya.funFact.items")} textColor="text-gray-300"/>
          </div>
          <p className="text-gray-200"><TranslateAnimation text={t("portfolio.projects.mayaya.funFact.war_intro")}/></p>
          <div>
            <ListSection items={tList(t, "portfolio.projects.mayaya.funFact.warSteps")} textColor="text-gray-300"/>
          </div>
          <p className="font-semibold text-gray-200"><TranslateAnimation text={t("portfolio.projects.mayaya.funFact.conclusion")}/></p>
        </Section>

        <Section emoji="💡" title={t("portfolio.projects.mayaya.remark")} titleColor="text-purple-300" borderColor="border-purple-500" >
          <p> <TranslateAnimation text={t("portfolio.projects.mayaya.remark_label")}/></p>
        </Section>

      </PageLayout>
    </>
  );
}
