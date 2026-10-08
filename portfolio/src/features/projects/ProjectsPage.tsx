import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { queryKeys } from "@/api";
import { getProjects } from "@/api/queries";
import { PageState } from "@/components/feedback/page-state";
import { InlineState } from "@/components/feedback/inline-state";
import { PageIntro } from "@/components/layout/page-intro";
import { ExternalLink as ExternalAnchor } from "@/components/ui/external-link";
import { formatProjectIndex, projectKey } from "./projectData";
import "./ProjectsPage.css";

export function ProjectsPage() {
  const { t } = useTranslation();
  const projects = useQuery({ queryKey: queryKeys.projects.list, queryFn: getProjects });

  if (projects.isPending) return <PageState eyebrow="projects_index / 03" title={t("portfolio.common.loading")} />;
  if (projects.isError) return <PageState eyebrow="projects_index / 03" title={t("portfolio.common.errorTitle")} message={t("portfolio.common.errorText")} action={{ label: t("portfolio.common.retry"), onClick: () => void projects.refetch() }} />;

  return (
    <article className="content-page site-container">
      <PageIntro
        eyebrow="projects_index / 03"
        title={t("portfolio.projects.title")}
        description={t("portfolio.projects.description")}
        aside={<span className="order-note">{t("portfolio.projects.order")}</span>}
      />
      <section className="project-list" aria-label={t("portfolio.projects.title")}>
        {projects.data.length ? projects.data.map((project, index) => (
          <article className="project-row" key={projectKey(project, index)}>
            <span className="project-index">{formatProjectIndex(index)}</span>
            <div>
              <h2>{project.name}</h2>
              {project.techStack && <code>{project.techStack}</code>}
            </div>
            {project.url && (
              <ExternalAnchor href={project.url}>
                {t("portfolio.projects.source")}<ExternalLink aria-hidden="true" />
              </ExternalAnchor>
            )}
          </article>
        )) : <InlineState>{t("portfolio.common.empty")}</InlineState>}
      </section>
    </article>
  );
}
