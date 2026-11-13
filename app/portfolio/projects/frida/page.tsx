"use client";

import { useTranslation } from "react-i18next";
import { fridaImages, fridaDofusImages } from "@/app/data/projectsData";
import Background from "@/app/components/portfolio/Background";
import Caroussel from "@/app/components/portfolio/Caroussel";
import PageLayout from "@/app/components/portfolio/projects/PayeLayout";
import ProjectHero from "@/app/components/portfolio/projects/ProjectHero";
import Section, { SectionColumn, SplitSection } from "@/app/components/portfolio/projects/Section";
import SectionCard from "@/app/components/portfolio/projects/SectionCard";
import StepsList, { Step } from "@/app/components/portfolio/projects/StepsList";
import ListSection from "@/app/components/portfolio/projects/ListSection";
import TabsSection from "@/app/components/portfolio/projects/TabSection";
import ModulePanel from "@/app/components/portfolio/projects/ModulePanel";
import TranslateAnimation from "@/app/components/TranslateAnimation";
import TreeView from "@/app/components/portfolio/projects/TreeView";
import { tList } from "@/utils/i18n";

const BASE = "portfolio.projects.frida";
const REPO_URL = "https://github.com/Ariedam64/FridaIL2CPPToolkit";

export default function FridaToolkitProjectPage() {
  const { t } = useTranslation("common");
  const tech = tList<string>(t, `${BASE}.tech`);
  const codeLink = [{ href: REPO_URL, label: t("portfolio.sections.viewCode"), primary: true }];

  return (
    <>
      <Background />
      <PageLayout>
        <ProjectHero
          title={t(`${BASE}.title`)}
          subtitle={t(`${BASE}.subtitle`)}
          // La capture Dofus parle plus qu'une liste de classes en haut de page.
          image={fridaDofusImages[0] ?? fridaImages[0]}
          tech={tech}
          links={codeLink}
        />

        <SplitSection>
          <SectionColumn title={t(`${BASE}.about.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.about.description`)} />
            </p>
            <p>
              <TranslateAnimation text={t(`${BASE}.about.frida`)} />
            </p>
          </SectionColumn>
          <SectionColumn title={t(`${BASE}.origin.title`)}>
            <p>
              <TranslateAnimation text={t(`${BASE}.origin.intro`)} />
            </p>
            <StepsList steps={tList<Step>(t, `${BASE}.origin.steps`)} />
          </SectionColumn>
        </SplitSection>

        <Section title={t(`${BASE}.workflow.title`)}>
          <p>
            <TranslateAnimation text={t(`${BASE}.workflow.intro`)} />
          </p>
          <StepsList steps={tList<Step>(t, `${BASE}.workflow.steps`)} />
        </Section>

        {/* Un seul module : TabsSection masque la barre d'onglets. */}
        <TabsSection
          eyebrow={t("portfolio.sections.architecture")}
          items={[{ key: "toolkit", label: t(`${BASE}.title`), content: null }]}
          renderContent={({ label }) => (
            <ModulePanel
              eyebrow={t("portfolio.sections.objective")}
              title={label}
              objective={t(`${BASE}.description`)}
              images={fridaImages}
              frameHeight="wide"
              tech={tech}
              links={codeLink}
            >
              <SectionCard title={t(`${BASE}.structure_title`)}>
                <TreeView treeText={t(`${BASE}.structure`)} />
              </SectionCard>
              <div className="grid gap-5 lg:grid-cols-2">
                <SectionCard title={t(`${BASE}.features_title`)}>
                  <ListSection items={tList(t, `${BASE}.features`)} />
                </SectionCard>
                <SectionCard title={t(`${BASE}.limits_title`)}>
                  <ListSection items={tList(t, `${BASE}.limits`)} />
                </SectionCard>
              </div>
            </ModulePanel>
          )}
        />

        <Section title={t(`${BASE}.dofus.title`)}>
          <p>
            <TranslateAnimation text={t(`${BASE}.dofus.description`)} />
          </p>
          {fridaDofusImages.length > 0 && (
            <div className="overflow-hidden rounded-xl bg-[#0e0c12]">
              <Caroussel images={fridaDofusImages} frameHeight="wide" />
            </div>
          )}
        </Section>

        <Section title={t(`${BASE}.learnings.title`)}>
          <ListSection items={tList(t, `${BASE}.learnings.items`)} />
        </Section>
      </PageLayout>
    </>
  );
}
