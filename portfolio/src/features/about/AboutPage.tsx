import { useQuery } from "@tanstack/react-query";
import { Layers3, MapPin, Pause, Play, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "../../app/preferences";
import { queryKeys } from "../../api/queryKeys";
import profilePhoto from "./assets/nurik.jpeg";
import skiingPhoto from "./assets/nurik-skiing.jpeg";
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
  const [requested, setRequested] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [paused, setPaused] = useState(false);

  const summary = useQuery({
    queryKey: queryKeys.about.summary(language),
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
      <section className={`about-hero${requested ? " has-summary" : ""}`} aria-labelledby="about-title">
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
          <div className="summary-action">
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
            <span className="ready-label">{t("redesign.about.ready")}</span>
          </div>
        </div>

        <div className="about-aside">
          <figure className="profile-photo">
            <img src={profilePhoto} alt={t("redesign.about.profileAlt")} />
            <figcaption>01 / nurzhanat.jpg</figcaption>
          </figure>
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

      <section className="profile-index" aria-labelledby="profile-index-title">
        <header>
          <p className="code-label">{"// profile"}</p>
          <h2 id="profile-index-title">{t("redesign.about.factsTitle")}</h2>
        </header>
        <dl>
          {profileFacts.map(({ key, Icon }) => (
            <div className="profile-index-row" key={key}>
              <dt>
                {t(`redesign.about.facts.${key}.label`)}
                <Icon aria-hidden="true" />
              </dt>
              <dd>
                <strong>{t(`redesign.about.facts.${key}.title`)}</strong>
                <span>{t(`redesign.about.facts.${key}.text`)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="story-grid" aria-labelledby="story-title">
        <header>
          <p className="code-label">{"// the route here"}</p>
          <h2 id="story-title">{t("redesign.about.story.title")}</h2>
          <div className="story-route" aria-hidden="true">
            <span>01</span><i /><span>02</span>
          </div>
        </header>
        <div className="story-copy">
          <article>
            <span>{t("redesign.about.story.then")}</span>
            <p>{t("redesign.about.story.text1")}</p>
          </article>
          <article>
            <span>{t("redesign.about.story.now")}</span>
            <p>{t("redesign.about.story.text2")}</p>
          </article>
        </div>
      </section>

      <section className="beyond-grid">
        <div>
          <p className="code-label">{"// beyond"}</p>
          <h2>{t("redesign.about.beyond.title")}</h2>
        </div>
        <div className="beyond-content">
          <div className="beyond-copy">
            <p>{t("redesign.about.beyond.text1")}</p>
            <p>{t("redesign.about.beyond.text2")}</p>
          </div>
          <div className="beyond-gallery">
            <figure className="beyond-photo beyond-photo-primary">
              <img src={skiingPhoto} alt={t("redesign.about.beyond.mountainAlt")} />
              <figcaption>01 / mountains — reset perspective</figcaption>
            </figure>
            <figure className="beyond-photo beyond-photo-secondary">
              <img src={forestPhoto} alt={t("redesign.about.beyond.hikeAlt")} />
              <figcaption>02 / trail — keep moving</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </article>
  );
}
