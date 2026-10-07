import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCertificates,
  getEducation,
  getSkills,
  getWorkExperience,
} from "../../api/queries/cv";
import { queryKeys } from "../../api/queryKeys";
import { PageState } from "../../components/feedback/PageState";
import { PageIntro } from "../../components/layout/PageIntro";
import { formatRange } from "./cvData";
import { calculateScrollProgress } from "./cvNavigation";

const sections = ["experience", "education", "skills", "certificates"] as const;

export function CVPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "kz" ? "kk" : "en";
  const work = useQuery({ queryKey: queryKeys.cv.work, queryFn: getWorkExperience });
  const education = useQuery({ queryKey: queryKeys.cv.education, queryFn: getEducation });
  const skills = useQuery({ queryKey: queryKeys.cv.skills, queryFn: getSkills });
  const certificates = useQuery({ queryKey: queryKeys.cv.certificates, queryFn: getCertificates });
  const queries = [work, education, skills, certificates];
  const isInitialLoading = queries.every((query) => query.isPending);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressFillRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]>("experience");

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollState = () => {
      const root = document.documentElement;
      const progress = calculateScrollProgress(window.scrollY, root.scrollHeight, root.clientHeight);

      progressFillRef.current?.style.setProperty("transform", `scaleX(${progress / 100})`);
      progressRef.current?.setAttribute("aria-valuenow", String(Math.round(progress)));

      const activationLine = Math.min(window.innerHeight * 0.35, 280);
      const current = [...sections].reverse().find((section) => {
        const element = document.getElementById(section);
        return element ? element.getBoundingClientRect().top <= activationLine : false;
      });
      const nextSection = current ?? "experience";
      setActiveSection((previousSection) => previousSection === nextSection ? previousSection : nextSection);
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateScrollState();
      });
    };

    updateScrollState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [isInitialLoading]);

  if (isInitialLoading) {
    return <PageState eyebrow="curriculum_vitae / 02" title={t("portfolio.common.loading")} />;
  }

  if (queries.every((query) => query.isError)) {
    return (
      <PageState
        eyebrow="curriculum_vitae / 02"
        title={t("portfolio.common.errorTitle")}
        message={t("portfolio.common.errorText")}
        action={{ label: t("portfolio.common.retry"), onClick: () => void Promise.all(queries.map((query) => query.refetch())) }}
      />
    );
  }

  return (
    <article className="content-page site-container">
      <PageIntro eyebrow="curriculum_vitae / 02" title={t("portfolio.cv.title")} />

      <nav className="section-nav" aria-label={t("portfolio.cv.sectionNavigation")}>
        {sections.map((section) => (
          <a
            className={activeSection === section ? "is-active" : undefined}
            key={section}
            href={`#${section}`}
            aria-current={activeSection === section ? "location" : undefined}
          >
            {t(`portfolio.cv.${section}`)}
          </a>
        ))}
        <span
          ref={progressRef}
          className="cv-progress"
          role="progressbar"
          aria-label={t("portfolio.cv.progress")}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <i ref={progressFillRef} />
        </span>
      </nav>

      <section id="experience" className="linear-section">
        <p className="code-label">{"// experience"}</p>
        <h2>{t("portfolio.cv.experience")}</h2>
        {work.isError ? <InlineError onRetry={() => void work.refetch()} /> : work.data?.length ? work.data.map((item) => (
          <div className="cv-row" key={item.id ?? `${item.company}-${item.startDate}`}>
            <div className="cv-meta">
              <span>{formatRange(item.startDate, item.endDate, locale, t("portfolio.cv.present"))}</span>
              <span>{item.location}</span>
            </div>
            <div className="cv-content">
              <h3>{item.position}</h3>
              <strong>{item.company}</strong>
              {item.description && <p>{item.description}</p>}
              {item.techStack && <code>{item.techStack}</code>}
            </div>
          </div>
        )) : <Empty />}
      </section>

      <section id="education" className="linear-section">
        <p className="code-label">{"// education"}</p>
        <h2>{t("portfolio.cv.education")}</h2>
        {education.isError ? <InlineError onRetry={() => void education.refetch()} /> : education.data?.length ? education.data.map((item) => (
          <div className="cv-row" key={item.id ?? `${item.institution}-${item.startDate}`}>
            <div className="cv-meta">
              <span>{formatRange(item.startDate, item.endDate, locale, t("portfolio.cv.present"))}</span>
              <span>{item.location}</span>
            </div>
            <div className="cv-content">
              <h3>{item.degree}</h3>
              <strong>{item.institution}</strong>
              {item.thesis && <p><b>{t("portfolio.cv.thesis")}:</b> {item.thesis}</p>}
              {item.description && <p>{item.description}</p>}
            </div>
          </div>
        )) : <Empty />}
      </section>

      <section id="skills" className="linear-section">
        <p className="code-label">{"// skills"}</p>
        <h2>{t("portfolio.cv.skills")}</h2>
        {skills.isError ? <InlineError onRetry={() => void skills.refetch()} /> : skills.data?.length ? skills.data.map((item) => (
          <div className="skill-row" key={item.id ?? item.category}>
            <h3>{item.category}</h3><code>{item.skillNames}</code>
          </div>
        )) : <Empty />}
      </section>

      <section id="certificates" className="linear-section">
        <p className="code-label">{"// certificates"}</p>
        <h2>{t("portfolio.cv.certificates")}</h2>
        {certificates.isError ? <InlineError onRetry={() => void certificates.refetch()} /> : certificates.data?.length ? certificates.data.map((item) => (
          <div className="certificate-row" key={item.id ?? item.name}>
            <h3>{item.name}</h3><span>{item.issuer}</span>
            {item.url && <a href={item.url} target="_blank" rel="noreferrer">{t("portfolio.cv.viewCertificate")}<ExternalLink aria-hidden="true" /></a>}
          </div>
        )) : <Empty />}
      </section>
    </article>
  );
}

function Empty() {
  const { t } = useTranslation();
  return <p className="inline-state">{t("portfolio.common.empty")}</p>;
}

function InlineError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return <p className="inline-state error-text">{t("portfolio.common.sectionError")} <button type="button" onClick={onRetry}>{t("portfolio.common.retry")}</button></p>;
}
