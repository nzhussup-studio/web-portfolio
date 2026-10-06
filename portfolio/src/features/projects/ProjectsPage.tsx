import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getProjects } from "../../api/base";
import { PageState } from "../../components/feedback/PageState";
import { PageIntro } from "../../components/layout/PageIntro";
import { formatProjectIndex, projectKey } from "./projectData";

export function ProjectsPage() {
  const { t } = useTranslation();
  const projects = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  if (projects.isPending) return <PageState eyebrow="projects_index / 03" title={t("redesign.common.loading")} />;
  if (projects.isError) return <PageState eyebrow="projects_index / 03" title={t("redesign.common.errorTitle")} message={t("redesign.common.errorText")} action={{ label: t("redesign.common.retry"), onClick: () => void projects.refetch() }} />;

  return (
    <article className="content-page site-container">
      <PageIntro
        eyebrow="projects_index / 03"
        title={t("redesign.projects.title")}
        description={t("redesign.projects.description")}
        aside={<span className="order-note">{t("redesign.projects.order")}</span>}
      />
      <section className="project-list" aria-label={t("redesign.projects.title")}>
        {projects.data.length ? projects.data.map((project, index) => (
          <article className="project-row" key={projectKey(project, index)}>
            <span className="project-index">{formatProjectIndex(index)}</span>
            <div>
              <h2>{project.name}</h2>
              {project.techStack && <code>{project.techStack}</code>}
            </div>
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer">
                {t("redesign.projects.source")}<ExternalLink aria-hidden="true" />
              </a>
            )}
          </article>
        )) : <p className="inline-state">{t("redesign.common.empty")}</p>}
      </section>
    </article>
  );
}
