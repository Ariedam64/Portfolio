"use client";

import { useTranslation } from "react-i18next";
import { arieModule, ModuleData } from "@/app/data/projectsData"
import Background from "../../../components/portfolio/Background";
import Caroussel from "../../../components/portfolio/Caroussel";
import SectionCard from "@/app/components/portfolio/projects/SectionCard";
import TechPills from "@/app/components/portfolio/projects/TechPills";
import ListSection from "@/app/components/portfolio/projects/ListSection";
import TranslateAnimation from "@/app/components/TranslateAnimation"
import Header from "@/app/components/portfolio/projects/Header";
import Section from "@/app/components/portfolio/projects/Section";
import StepsList from "@/app/components/portfolio/projects/StepsList";
import TreeView from "@/app/components/portfolio/projects/TreeView";
import { tList } from "@/utils/i18n";
import PageLayout from "@/app/components/portfolio/projects/PayeLayout";
import TabsSection, { TabItem } from "@/app/components/portfolio/projects/TabSection"

export default function ArieProject() {
  const { t } = useTranslation("common");

    const projectTabs: TabItem<ModuleData>[] = arieModule.map((m) => ({
        key: m.key,
        label: t(m.labelKey),
        content: m,
    }));

  return (
    <>
        <Background />
        <PageLayout>
            <Header emoji="🤖" title={t("portfolio.projects.arie.title")} subtitle={t("portfolio.projects.arie.subtitle")}/>
            <Section emoji="🎮" title={t("portfolio.projects.arie.discord_title")}>
                <TranslateAnimation text={t("portfolio.projects.arie.discord_desc")} />
            </Section>
            <Section emoji="🚀" title={t("portfolio.projects.arie.origin.title")}>
                <p><TranslateAnimation text={t("portfolio.projects.arie.origin.description")} /></p>
                <StepsList steps={tList(t, "portfolio.projects.arie.origin.steps")}/>
                <p><TranslateAnimation text={t("portfolio.projects.arie.origin.conclusion")} /></p>
            </Section>
            <TabsSection
                title={t("portfolio.sections.architecture")}
                items={projectTabs}
                renderContent={({ content: m }) => {
                    const base = `portfolio.projects.arie.modules.${m.key}`;
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
                        <SectionCard title={t("portfolio.sections.limits")} icon="❌" borderColor="border-red-500" >
                            <ListSection items={tList(t, m.limitsKey) as string[]} textColor="text-gray-300"/>
                        </SectionCard>
                        <TechPills items={tList(t, m.techKey) as string[]} />
                        <Caroussel className="mx-auto" images={m.images} />
                        <div className="flex justify-center">
                            <a href={m.repoUrl} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">
                            <TranslateAnimation text={t("portfolio.sections.viewCode")} />
                            </a>
                        </div>
                    </div>
                    );
                }}
            />
            <Section emoji="⚙️" title={t("portfolio.projects.arie.enhancement")}>
                <ListSection items={tList(t, "portfolio.projects.arie.enhancements")} textColor="text-gray-300" listStyle="disc"/>
            </Section>
        </PageLayout>
    </>
  )
}