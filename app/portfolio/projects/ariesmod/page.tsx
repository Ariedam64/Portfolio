"use client";

import { useTranslation } from "react-i18next";
import { ariesmodModule, ModuleData } from "@/app/data/projectsData";
import Background from "@/app/components/portfolio/Background";
import PageLayout from "@/app/components/portfolio/projects/PayeLayout";
import ProjectHero, { interleaveTech } from "@/app/components/portfolio/projects/ProjectHero";
import StatsStrip, { Stat } from "@/app/components/portfolio/projects/StatsStrip";
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

const BASE = "portfolio.projects.ariesmod";
const MOD_REPO = "https://github.com/Ariedam64/MG-AriesMod";
const EXPLORER_URL = "https://ariesmod-api.ariedam.fr/explorer";

export default function AriesModProjectPage() {
  const { t } = useTranslation("common");

  const projectTabs: TabItem<ModuleData>[] = ariesmodModule.map((module) => ({
    key: module.key,
    label: t(module.labelKey),
    content: module,
  }));

  /** Libellé optionnel : absent des traductions, i18next renvoie la clé. */
  const optional = (key: string) => {
    const value = t(key);
    return value === key ? null : value;
  };

  return (
    <>
      <Background />
      <PageLayout>
        <ProjectHero
          title={t(`${BASE}.title`)}
          subtitle={t(`${BASE}.subtitle`)}
          image="/img/ariesmod1.webp"
          tech={interleaveTech(ariesmodModule.map((m) => tList<string>(t, m.techKey)))}
          links={[
            { href: MOD_REPO, label: t("portfolio.sections.viewCode"), primary: true },
            { href: EXPLORER_URL, label: "Garden Explorer" },
          ]}
        />

        <StatsStrip items={tList<Stat>(t, `${BASE}.stats`)} />

        <SplitSection className="lg:grid-cols-[1fr_1.3fr]">
          <SectionColumn eyebrow={t("portfolio.sections.game")} title={t(`${BASE}.game.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.game.description`)} />
            </p>
            <a
              href="https://magicgarden.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-[#c084fc] hover:underline"
            >
              {t(`${BASE}.game.link_label`)} →
            </a>
          </SectionColumn>
          <SectionColumn eyebrow={t(`${BASE}.origin.title`)} title={t(`${BASE}.origin.headline`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.origin.intro`)} />
            </p>
            <StepsList steps={tList<Step>(t, `${BASE}.origin.steps`)} />
            <p>
              <TranslateAnimation text={t(`${BASE}.origin.conclusion`)} />
            </p>
          </SectionColumn>
        </SplitSection>

        <TabsSection
          eyebrow={t("portfolio.sections.architecture")}
          title={t(`${BASE}.architecture_headline`)}
          items={projectTabs}
          renderContent={({ label, content: module }) => {
            const base = `${BASE}.modules.${module.key}`;
            const optimizationTitle = optional(`${base}.optimization_title`);
            const chessTitle = optional(`${base}.chess_title`);

            return (
              <ModulePanel
                eyebrow={t("portfolio.sections.objective")}
                title={label}
                objective={t(module.objectiveKey)}
                images={module.images}
                frameHeight={module.frameHeight}
                tech={tList<string>(t, module.techKey)}
                links={codeAndSiteLinks(t, module)}
              >
                <SectionCard title={t(`${base}.story_title`)}>
                  <div className="space-y-4">
                    <p>
                      <TranslateAnimation text={t(`${base}.story_intro`)} />
                    </p>
                    <StepsList steps={tList<Step>(t, `${base}.story_steps`)} />
                  </div>
                </SectionCard>

                <SectionCard title={t(`${base}.structure_title`)}>
                  <TreeView treeText={t(`${base}.structure`)} />
                </SectionCard>

                {optimizationTitle && (
                  <SectionCard title={optimizationTitle}>
                    <ListSection items={tList(t, `${base}.optimization_rules`)} />
                  </SectionCard>
                )}

                {chessTitle && (
                  <SectionCard title={chessTitle}>
                    <div className="space-y-4">
                      <p>
                        <TranslateAnimation text={t(`${base}.chess_intro`)} />
                      </p>
                      <ListSection items={tList(t, `${base}.chess_points`)} />
                      <p className="text-[#e9d5ff]">
                        <TranslateAnimation text={t(`${base}.chess_outro`)} />
                      </p>
                    </div>
                  </SectionCard>
                )}

                <div className="grid gap-5 lg:grid-cols-2">
                  <SectionCard title={t("portfolio.sections.features")}>
                    <ListSection items={tList(t, module.featuresKey)} />
                  </SectionCard>
                  <SectionCard title={t("portfolio.sections.limits")}>
                    <ListSection items={tList(t, module.limitsKey)} />
                  </SectionCard>
                </div>
              </ModulePanel>
            );
          }}
        />

        <Section title={t(`${BASE}.extras.title`)}>
          <ListSection items={tList(t, `${BASE}.extras.items`)} />
        </Section>

        <div className="grid gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-6">
          <Section title={t(`${BASE}.impact.title`)}>
            <ListSection items={tList(t, `${BASE}.impact.items`)} />
          </Section>
          <Section title={t(`${BASE}.learnings.title`)}>
            <ListSection items={tList(t, `${BASE}.learnings.items`)} />
          </Section>
        </div>
      </PageLayout>
    </>
  );
}
