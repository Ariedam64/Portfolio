"use client";

import { useTranslation } from "react-i18next";
import { snapscoreModule, ModuleData } from "@/app/data/projectsData";
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
import { tList } from "@/utils/i18n";

const BASE = "portfolio.projects.snapscore";
const REPO_URL = "https://github.com/Ariedam64/SnapScore-V2";

export default function SnapscoreProjectPage() {
  const { t } = useTranslation("common");

  const projectTabs: TabItem<ModuleData>[] = snapscoreModule.map((module) => ({
    key: module.key,
    label: t(module.labelKey),
    content: module,
  }));

  const originFocusKey = `${BASE}.origin.focus`;
  const originFocus = t(originFocusKey);
  const showOriginFocus = originFocus !== originFocusKey;

  return (
    <>
      <Background />
      <PageLayout>
        <ProjectHero
          title={t(`${BASE}.title`)}
          subtitle={t(`${BASE}.subtitle`)}
          image="/img/snapchat2.webp"
          tech={interleaveTech(snapscoreModule.map((m) => tList<string>(t, m.techKey)))}
          links={[{ href: REPO_URL, label: t("portfolio.sections.viewCode"), primary: true }]}
        />

        <SplitSection>
          <SectionColumn title={t(`${BASE}.snapchat.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.snapchat.description`)} />
            </p>
            <ListSection items={tList(t, `${BASE}.snapchat.rules`)} />
            <p>
              <TranslateAnimation text={t(`${BASE}.snapchat.context`)} />
            </p>
          </SectionColumn>
          <SectionColumn title={t(`${BASE}.origin.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.origin.intro`)} />
            </p>
            <StepsList steps={tList<Step>(t, `${BASE}.origin.steps`)} />
            {showOriginFocus && (
              <p>
                <TranslateAnimation text={originFocus} />
              </p>
            )}
          </SectionColumn>
        </SplitSection>

        <TabsSection
          eyebrow={t("portfolio.sections.architecture")}
          items={projectTabs}
          renderContent={({ label, content: module }) => (
            <ModulePanel
              eyebrow={t("portfolio.sections.objective")}
              title={label}
              objective={t(module.objectiveKey)}
              images={module.images}
              frameHeight={module.frameHeight}
              tech={tList<string>(t, module.techKey)}
              links={codeAndSiteLinks(t, module)}
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <SectionCard title={t("portfolio.sections.advantages")}>
                  <ListSection items={tList(t, module.featuresKey)} />
                </SectionCard>
                <SectionCard title={t("portfolio.sections.limits")}>
                  <ListSection items={tList(t, module.limitsKey)} />
                </SectionCard>
              </div>
            </ModulePanel>
          )}
        />

        <Section title={t(`${BASE}.observation.title`)}>
          <ListSection items={tList(t, `${BASE}.observation.items`)} />
          <p>
            <TranslateAnimation text={t(`${BASE}.observation.conclusion`)} />
          </p>
        </Section>

        <Section title={t(`${BASE}.code.title`)} className="space-y-5">
          <SectionCard title={t(`${BASE}.code.structureTitle`)}>
            <TreeView treeText={t(`${BASE}.code.structure`)} />
          </SectionCard>
          <SectionCard title={t(`${BASE}.code.modulesTitle`)}>
            <StepsList steps={tList<Step>(t, `${BASE}.code.modules`)} />
          </SectionCard>
        </Section>

        <Section title={t(`${BASE}.operating_title`)} className="grid gap-5 space-y-0 lg:grid-cols-2">
          <SectionCard title={t(`${BASE}.management.title`)}>
            <ListSection items={tList(t, `${BASE}.management.items`)} />
          </SectionCard>
          <SectionCard title={t(`${BASE}.monitoring.title`)}>
            <ListSection items={tList(t, `${BASE}.monitoring.items`)} />
          </SectionCard>
          <SectionCard title={t(`${BASE}.rules.title`)}>
            <ListSection items={tList(t, `${BASE}.rules.items`)} />
          </SectionCard>
          <SectionCard title={t(`${BASE}.performance.title`)}>
            <ListSection items={tList(t, `${BASE}.performance.items`)} />
          </SectionCard>
        </Section>

        <div className="grid gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-6">
          <Section title={t(`${BASE}.learnings.title`)}>
            <ListSection items={tList(t, `${BASE}.learnings.items`)} />
          </Section>
          <Section title={t(`${BASE}.remark.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.remark.description`)} />
            </p>
          </Section>
        </div>
      </PageLayout>
    </>
  );
}
