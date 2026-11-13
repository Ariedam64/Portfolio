"use client";

import { useTranslation } from "react-i18next";
import { arieModule, ModuleData } from "@/app/data/projectsData";
import Background from "@/app/components/portfolio/Background";
import PageLayout from "@/app/components/portfolio/projects/PayeLayout";
import ProjectHero, { interleaveTech } from "@/app/components/portfolio/projects/ProjectHero";
import Section, { SectionColumn, SplitSection } from "@/app/components/portfolio/projects/Section";
import SectionCard from "@/app/components/portfolio/projects/SectionCard";
import StepsList, { Step } from "@/app/components/portfolio/projects/StepsList";
import ListSection from "@/app/components/portfolio/projects/ListSection";
import ModulePanel from "@/app/components/portfolio/projects/ModulePanel";
import { codeAndSiteLinks } from "@/app/components/portfolio/projects/ProjectLinks";
import TranslateAnimation from "@/app/components/TranslateAnimation";
import TabsSection, { TabItem } from "@/app/components/portfolio/projects/TabSection";
import TreeView from "@/app/components/portfolio/projects/TreeView";
import { isVideo } from "@/app/components/portfolio/Lightbox";
import { tList } from "@/utils/i18n";

const BASE = "portfolio.projects.arie";

export default function ArieProject() {
  const { t } = useTranslation("common");

  const projectTabs: TabItem<ModuleData>[] = arieModule.map((m) => ({
    key: m.key,
    label: t(m.labelKey),
    content: m,
  }));
  const main = arieModule[0];

  return (
    <>
      <Background />
      <PageLayout>
        <ProjectHero
          title={t(`${BASE}.title`)}
          subtitle={t(`${BASE}.subtitle`)}
          // La première capture est une vidéo : le haut de page prend la première image fixe.
          image={main.images?.find((src) => !isVideo(src))}
          tech={interleaveTech(arieModule.map((m) => tList<string>(t, m.techKey)))}
          links={codeAndSiteLinks(t, main)}
        />

        <SplitSection>
          <SectionColumn title={t(`${BASE}.discord_title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.discord_desc`)} />
            </p>
          </SectionColumn>
          <SectionColumn title={t(`${BASE}.origin.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.origin.description`)} />
            </p>
            <StepsList steps={tList<Step>(t, `${BASE}.origin.steps`)} />
            <p>
              <TranslateAnimation text={t(`${BASE}.origin.conclusion`)} />
            </p>
          </SectionColumn>
        </SplitSection>

        <TabsSection
          eyebrow={t("portfolio.sections.architecture")}
          items={projectTabs}
          renderContent={({ label, content: m }) => {
            const base = `${BASE}.modules.${m.key}`;
            return (
              <ModulePanel
                eyebrow={t("portfolio.sections.objective")}
                title={label}
                objective={t(m.objectiveKey)}
                images={m.images}
                frameHeight={m.frameHeight}
                tech={tList<string>(t, m.techKey)}
                links={codeAndSiteLinks(t, m)}
              >
                <SectionCard title={t(`${base}.structure_title`)}>
                  <TreeView treeText={t(`${base}.structure`)} />
                </SectionCard>
                <div className="grid gap-5 lg:grid-cols-2">
                  <SectionCard title={t("portfolio.sections.features")}>
                    <ListSection items={tList(t, m.featuresKey)} />
                  </SectionCard>
                  <SectionCard title={t("portfolio.sections.limits")}>
                    <ListSection items={tList(t, m.limitsKey)} />
                  </SectionCard>
                </div>
              </ModulePanel>
            );
          }}
        />

        <Section title={t(`${BASE}.enhancement`)}>
          <ListSection items={tList(t, `${BASE}.enhancements`)} />
        </Section>
      </PageLayout>
    </>
  );
}
