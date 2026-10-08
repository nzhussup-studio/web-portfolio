import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers3, MapPin, Pause, Play, RefreshCw, Sparkles, SquareTerminal } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "../../app/preferences";
import { queryKeys } from "../../api/queryKeys";
import { Button } from "../../components/ui/Button";
import { CodeLabel } from "../../components/ui/CodeLabel";
import profilePhoto from "./assets/nurik.jpeg";
import mountainsPhoto from "./assets/mountains.jpeg";
import forestPhoto from "./assets/forest.jpeg";
import { fetchSummary } from "./aboutApi";

type AboutPageProps = {
  language: Language;
};

const profileFacts = [
  { key: "vienna", Icon: MapPin },
  { key: "systems", Icon: Layers3 },
  { key: "learning", Icon: RefreshCw },
] as const;

export function AboutPage({ language }: AboutPageProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [requestedLanguage, setRequestedLanguage] = useState<Language | null>(null);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [paused, setPaused] = useState(false);
  const requested = requestedLanguage === language;

  const summary = useQuery({
    queryKey: queryKeys.about.summary(language),
    queryFn: ({ signal }) => fetchSummary(language, signal),
    enabled: requested,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    setRequestedLanguage(null);
    setVisibleCharacters(0);
    setPaused(false);
  }, [language]);

  useEffect(() => () => {
    void queryClient.cancelQueries({ queryKey: queryKeys.about.summary(language) });
  }, [language, queryClient]);

  useEffect(() => {
    if (!summary.data || paused || visibleCharacters >= summary.data.length) return;
    const timer = window.setTimeout(
      () => setVisibleCharacters((current) => current + 1),
      8,
    );
    return () => window.clearTimeout(timer);
  }, [paused, summary.data, visibleCharacters]);

  const isGenerating = requested && summary.isFetching;
  const isRevealing = Boolean(summary.data && visibleCharacters < summary.data.length);

  return (
    <article className="about-page site-container">
      <section className={`about-hero${requested ? " has-summary" : ""}`} aria-labelledby="about-title">
        <div className="about-copy">
          <CodeLabel>hello.world / 01</CodeLabel>
          <h1 id="about-title">
            {t("portfolio.about.title")}
            <span aria-hidden="true">.</span>
          </h1>
          <p className="hero-subtitle">{t("portfolio.about.subtitle")}</p>
          <div className="intro-copy">
            <p>{t("portfolio.about.intro1")}</p>
            <p>{t("portfolio.about.intro2")}</p>
          </div>
          <div className="summary-action">
            {!requested ? (
              <Button size="large" onClick={() => setRequestedLanguage(language)}>
                <Sparkles aria-hidden="true" />
                {t("portfolio.about.generate")}
              </Button>
            ) : isGenerating ? (
              <Button size="large" disabled aria-busy="true">
                <RefreshCw className="summary-spinner" aria-hidden="true" />
                {t("portfolio.about.generating")}
              </Button>
            ) : isRevealing ? (
              <Button size="large" onClick={() => setPaused((value) => !value)}>
                {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
                {paused ? t("portfolio.about.resume") : t("portfolio.about.pause")}
              </Button>
            ) : (
              <Button
                size="large"
                onClick={() => {
                  setVisibleCharacters(0);
                  setPaused(false);
                  void summary.refetch();
                }}
              >
                <Sparkles aria-hidden="true" />
                {t("portfolio.about.regenerate")}
              </Button>
            )}
            <span className="ready-label">{t("portfolio.about.ready")}</span>
          </div>
        </div>

        <div className="about-aside">
          <figure className="profile-photo">
            <img src={profilePhoto} alt={t("portfolio.about.profileAlt")} />
            <figcaption>01 / nurzhanat.jpg</figcaption>
          </figure>
        </div>
      </section>

      {requested && (
        <section className="summary-output" aria-live="polite" aria-busy={summary.isFetching}>
          <CodeLabel>ai.summary / live</CodeLabel>
          {summary.isPending && <p>{t("portfolio.about.loading")}</p>}
          {summary.isError && <p className="error-text">{t("portfolio.about.error")}</p>}
          {summary.data && <p>{summary.data.slice(0, visibleCharacters)}</p>}
        </section>
      )}

      <section className="profile-index" aria-labelledby="profile-index-title">
        <header>
          <CodeLabel>{"// profile"}</CodeLabel>
          <h2 id="profile-index-title">{t("portfolio.about.factsTitle")}</h2>
        </header>
        <dl>
          {profileFacts.map(({ key, Icon }) => (
            <div className="profile-index-row" key={key}>
              <dt>
                {t(`portfolio.about.facts.${key}.label`)}
                <Icon aria-hidden="true" />
              </dt>
              <dd>
                <strong>{t(`portfolio.about.facts.${key}.title`)}</strong>
                <span>{t(`portfolio.about.facts.${key}.text`)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="story-grid" aria-labelledby="story-title">
        <header>
          <CodeLabel>{"// the route here"}</CodeLabel>
          <h2 id="story-title">{t("portfolio.about.story.title")}</h2>
          <div className="story-route" aria-hidden="true">
            <span>01</span><i /><span>02</span>
          </div>
        </header>
        <div className="story-copy">
          <article>
            <span>{t("portfolio.about.story.then")}</span>
            <p>{t("portfolio.about.story.text1")}</p>
          </article>
          <article>
            <span>{t("portfolio.about.story.now")}</span>
            <p>{t("portfolio.about.story.text2")}</p>
          </article>
        </div>
      </section>

      <section className="beyond-grid">
        <div>
          <CodeLabel>{"// beyond"}</CodeLabel>
          <h2>{t("portfolio.about.beyond.title")}</h2>
        </div>
        <div className="beyond-content">
          <div className="beyond-copy">
            <p>{t("portfolio.about.beyond.text1")}</p>
            <p>{t("portfolio.about.beyond.text2")}</p>
          </div>
          <div className="beyond-gallery">
            <figure className="beyond-photo beyond-photo-primary">
              <img src={mountainsPhoto} alt={t("portfolio.about.beyond.mountainAlt")} />
              <figcaption>01 / mountains — reset perspective</figcaption>
            </figure>
            <figure className="beyond-photo beyond-photo-secondary">
              <img src={forestPhoto} alt={t("portfolio.about.beyond.hikeAlt")} />
              <figcaption>02 / trail — keep moving</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <aside className="nerd-note" aria-label={t("portfolio.about.curious.title")}>
        <div>
          <CodeLabel>{"// for the curious"}</CodeLabel>
          <h2>{t("portfolio.about.curious.title")}</h2>
        </div>
        <p>
          <SquareTerminal aria-hidden="true" />
          <span>{t("portfolio.about.curious.text")} <code>help</code>.</span>
        </p>
      </aside>
    </article>
  );
}
