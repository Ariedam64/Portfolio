"use client";

import { useTranslation } from "react-i18next";
import { ariesmodModule, ModuleData } from "@/app/data/projectsData";
import Background from "@/app/components/portfolio/Background";
import Caroussel from "@/app/components/portfolio/Caroussel";
import PageLayout from "@/app/components/portfolio/projects/PayeLayout";
import Header from "@/app/components/portfolio/projects/Header";
import Section from "@/app/components/portfolio/projects/Section";
import SectionCard from "@/app/components/portfolio/projects/SectionCard";
import StepsList, { Step } from "@/app/components/portfolio/projects/StepsList";
import ListSection from "@/app/components/portfolio/projects/ListSection";
import TechPills from "@/app/components/portfolio/projects/TechPills";
import TranslateAnimation from "@/app/components/TranslateAnimation";
import TabsSection, { TabItem } from "@/app/components/portfolio/projects/TabSection";
import TreeView from "@/app/components/portfolio/projects/TreeView";
import { tList } from "@/utils/i18n";

export default function AriesModProjectPage() {
  const { t } = useTranslation("common");

  const projectTabs: TabItem<ModuleData>[] = ariesmodModule.map((module) => ({
    key: module.key,
    label: t(module.labelKey),
    content: module,
  }));

  const originSteps = tList<Step>(t, "portfolio.projects.ariesmod.origin.steps");
  const impactItems = tList(t, "portfolio.projects.ariesmod.impact.items");
  const learningsItems = tList(t, "portfolio.projects.ariesmod.learnings.items");

  return (
    <>
      <Background />
      <PageLayout>
        <Header
          emoji="🌿"
          title={t("portfolio.projects.ariesmod.title")}
          subtitle={t("portfolio.projects.ariesmod.subtitle")}
        />

        <Section emoji="🌱" title={t("portfolio.projects.ariesmod.game.title")}>
          <div className="space-y-3">
            <TranslateAnimation text={t("portfolio.projects.ariesmod.game.description")} />
            <a
              href="https://magicgarden.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-purple-300 hover:underline"
            >
              {t("portfolio.projects.ariesmod.game.link_label")} →
            </a>
          </div>
        </Section>

        <Section emoji="🚀" title={t("portfolio.projects.ariesmod.origin.title")}>
          <div className="space-y-4">
            <TranslateAnimation text={t("portfolio.projects.ariesmod.origin.intro")} />
            <StepsList steps={originSteps} />
            <p className="text-gray-300">
              <TranslateAnimation text={t("portfolio.projects.ariesmod.origin.conclusion")} />
            </p>
          </div>
        </Section>

        <TabsSection
          title={t("portfolio.sections.architecture")}
          items={projectTabs}
          renderContent={({ content: module }) => {
            const base = `portfolio.projects.ariesmod.modules.${module.key}`;
            const storySteps = tList<Step>(t, `${base}.story_steps`);
            const structureText = t(`${base}.structure`);
            const structureTitleKey = `${base}.structure_title`;
            const optimizationTitleKey = `${base}.optimization_title`;
            const optimizationTitle = t(optimizationTitleKey);
            const hasOptimization = optimizationTitle !== optimizationTitleKey;

            return (
              <div className="space-y-6 bg-zinc-800/40 p-6 rounded-lg">
                <SectionCard title={t("portfolio.sections.objective")} icon="🎯" borderColor="border-[#9333ea]">
                  <p>
                    <TranslateAnimation text={t(module.objectiveKey)} />
                  </p>
                </SectionCard>

                <SectionCard title={t(`${base}.story_title`)} icon="📖" borderColor="border-blue-500">
                  <div className="space-y-4">
                    <TranslateAnimation text={t(`${base}.story_intro`)} />
                    <StepsList steps={storySteps} />
                  </div>
                </SectionCard>

                <SectionCard title={t(structureTitleKey)} icon="🗂️" borderColor="border-fuchsia-500">
                  <TreeView treeText={structureText} />
                </SectionCard>

                {hasOptimization && (
                  <SectionCard title={optimizationTitle} icon="⚡" borderColor="border-amber-500">
                    <ListSection items={tList(t, `${base}.optimization_rules`)} textColor="text-gray-300" />
                  </SectionCard>
                )}

                <SectionCard title={t("portfolio.sections.features")} icon="⚙️" borderColor="border-green-500">
                  <ListSection items={tList(t, module.featuresKey)} textColor="text-gray-300" />
                </SectionCard>

                <SectionCard title={t("portfolio.sections.limits")} icon="❌" borderColor="border-red-500">
                  <ListSection items={tList(t, module.limitsKey)} textColor="text-gray-300" />
                </SectionCard>

                <TechPills items={tList(t, module.techKey)} />
                <Caroussel className="mx-auto" images={module.images} />
                {module.repoUrl && (
                  <div className="flex justify-center">
                    <a
                      href={module.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:underline"
                    >
                      <TranslateAnimation text={t("portfolio.sections.viewCode")} />
                    </a>
                  </div>
                )}
              </div>
            );
          }}
        />

        <Section emoji="📊" title={t("portfolio.projects.ariesmod.impact.title")}>
          <ListSection items={impactItems} textColor="text-gray-300" />
        </Section>

        <Section emoji="📝" title={t("portfolio.projects.ariesmod.learnings.title")}>
          <ListSection items={learningsItems} textColor="text-gray-300" />
        </Section>

        <Section emoji="💡" title={t("portfolio.projects.ariesmod.remark.title")} titleColor="text-purple-300" borderColor="border-purple-500">
          <TranslateAnimation text={t("portfolio.projects.ariesmod.remark.description")} />
        </Section>
      </PageLayout>
    </>
  );
}
