import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import { isNotFoundError, queryKeys } from "@/api";
import { getAlbum } from "@/api/queries";
import { PageState } from "@/components/feedback/page-state";
import { BackLink } from "@/components/ui/back-link";
import { CodeLabel } from "@/components/ui/code-label";
import { DisplayTitle } from "@/components/ui/display-title";
import { albumImageSource } from "./albumData";
import "./AlbumDetailPage.css";

export function AlbumDetailPage() {
  const { t } = useTranslation();
  const { albumID = "" } = useParams();
  const [activeIndex, setActiveIndex] = useState(-1);
  const album = useQuery({
    queryKey: queryKeys.albums.detail(albumID),
    queryFn: () => getAlbum(albumID),
    enabled: Boolean(albumID),
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
  });

  if (album.isPending) return <PageState eyebrow="photo_archive / loading" title={t("portfolio.common.loading")} />;
  if (album.isError && isNotFoundError(album.error)) {
    return (
      <PageState
        eyebrow="404 / album"
        title={t("portfolio.albums.notFoundTitle")}
        message={t("portfolio.albums.notFoundText")}
        link={{ label: t("portfolio.albums.back"), to: "/albums" }}
      />
    );
  }
  if (album.isError) return <PageState eyebrow="albums / unavailable" title={t("portfolio.common.errorTitle")} message={t("portfolio.common.errorText")} action={{ label: t("portfolio.common.retry"), onClick: () => void album.refetch() }} link={{ label: t("portfolio.albums.back"), to: "/albums" }} />;

  const images = (album.data.images ?? []).map((image) => ({ image, src: albumImageSource(albumID, image) })).filter((item): item is typeof item & { src: string } => Boolean(item.src));
  return (
    <article className="content-page site-container album-detail">
      <BackLink to="/albums">{t("portfolio.albums.back")}</BackLink>
      <header>
        <CodeLabel tone="accent">photo_archive / {albumID}</CodeLabel>
        <DisplayTitle>{album.data.title}</DisplayTitle>
        <div className="album-detail-meta">
          {album.data.date && <time>{album.data.date}</time>}
          <span>{t("portfolio.albums.photoCount", { count: images.length })}</span>
        </div>
        {album.data.desc && <p>{album.data.desc}</p>}
      </header>
      {images.length ? (
        <section className="photo-grid">
          {images.map(({ image, src }, index) => (
            <button type="button" onClick={() => setActiveIndex(index)} key={image.id ?? src} aria-label={t("portfolio.albums.openPhoto", { number: index + 1 })}>
              <img src={src} alt="" loading="lazy" />
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </section>
      ) : <div className="empty-gallery"><ImageIcon aria-hidden="true" /><p>{t("portfolio.albums.empty")}</p></div>}
      <Lightbox open={activeIndex >= 0} close={() => setActiveIndex(-1)} index={Math.max(0, activeIndex)} slides={images.map(({ src }) => ({ src }))} />
    </article>
  );
}
