import { useQuery } from "@tanstack/react-query";
import { Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "../../app/preferences";
import { fetchSummary } from "./aboutApi";

type AboutPageProps = {
  language: Language;
};

export function AboutPage({ language }: AboutPageProps) {
  const { t } = useTranslation();
  const [requested, setRequested] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [paused, setPaused] = useState(false);

  const summary = useQuery({
    queryKey: ["ai-summary", language],
    queryFn: ({ signal }) => fetchSummary(language, signal),
    enabled: requested,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    setRequested(false);
    setVisibleCharacters(0);
    setPaused(false);
  }, [language]);

  useEffect(() => {
    if (!summary.data || paused || visibleCharacters >= summary.data.length) return;
    const timer = window.setTimeout(
      () => setVisibleCharacters((current) => current + 1),
      8,
    );
    return () => window.clearTimeout(timer);
  }, [paused, summary.data, visibleCharacters]);

  const isRevealing = Boolean(summary.data && visibleCharacters < summary.data.length);

  return (
    <article className="about-page site-container">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-copy">
          <p className="code-label">hello.world / 01</p>
          <h1 id="about-title">
            {t("redesign.about.title")}
            <span aria-hidden="true">.</span>
          </h1>
          <p className="hero-subtitle">{t("redesign.about.subtitle")}</p>
          <div className="intro-copy">
            <p>{t("redesign.about.intro1")}</p>
            <p>{t("redesign.about.intro2")}</p>
          </div>
        </div>

        <div className="summary-control">
          <div className="cursor-mark" aria-hidden="true">
            <span>[</span><i /><span>]</span>
          </div>
          {!requested ? (
            <button className="summary-button" type="button" onClick={() => setRequested(true)}>
              <Sparkles aria-hidden="true" />
              {t("redesign.about.generate")}
            </button>
          ) : isRevealing ? (
            <button className="summary-button" type="button" onClick={() => setPaused((value) => !value)}>
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              {paused ? t("redesign.about.resume") : t("redesign.about.pause")}
            </button>
          ) : (
            <button
              className="summary-button"
              type="button"
              onClick={() => {
                setVisibleCharacters(0);
                setPaused(false);
                void summary.refetch();
              }}
            >
              <Sparkles aria-hidden="true" />
              {t("redesign.about.regenerate")}
            </button>
          )}
          <span className="ready-label"><i />{t("redesign.about.ready")}</span>
        </div>
      </section>

      {requested && (
        <section className="summary-output" aria-live="polite" aria-busy={summary.isFetching}>
          <p className="code-label">ai.summary / live</p>
          {summary.isPending && <p>{t("redesign.about.loading")}</p>}
          {summary.isError && <p className="error-text">{t("redesign.about.error")}</p>}
          {summary.data && <p>{summary.data.slice(0, visibleCharacters)}</p>}
        </section>
      )}

      <section className="facts-grid" aria-label={t("redesign.about.factsLabel")}>
        {["vienna", "systems", "learning"].map((fact, index) => (
          <div className="fact" key={fact}>
            <span className="fact-index">0{index + 1}</span>
            <h2>{t(`redesign.about.facts.${fact}.title`)}</h2>
            <p>{t(`redesign.about.facts.${fact}.text`)}</p>
          </div>
        ))}
      </section>

      <section className="beyond-grid">
        <div>
          <p className="code-label">{"// beyond"}</p>
          <h2>{t("redesign.about.beyond.title")}</h2>
        </div>
        <p>{t("redesign.about.beyond.text")}</p>
      </section>
    </article>
  );
}
