import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import { getAlbum } from "../../api/base";
import { isNotFoundError } from "../../api/errors";
import { PageState } from "../../components/feedback/PageState";
import { albumImageSource } from "./albumData";

export function AlbumDetailPage() {
  const { t } = useTranslation();
  const { albumID = "" } = useParams();
  const [activeIndex, setActiveIndex] = useState(-1);
  const album = useQuery({
    queryKey: ["album", albumID],
    queryFn: () => getAlbum(albumID),
    enabled: Boolean(albumID),
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
  });

  if (album.isPending) return <PageState eyebrow="photo_archive / loading" title={t("redesign.common.loading")} />;
  if (album.isError && isNotFoundError(album.error)) {
    return (
      <PageState
        eyebrow="404 / album"
        title={t("redesign.albums.notFoundTitle")}
        message={t("redesign.albums.notFoundText")}
        link={{ label: t("redesign.albums.back"), to: "/albums" }}
      />
    );
  }
  if (album.isError) return <PageState eyebrow="albums / unavailable" title={t("redesign.common.errorTitle")} message={t("redesign.common.errorText")} action={{ label: t("redesign.common.retry"), onClick: () => void album.refetch() }} link={{ label: t("redesign.albums.back"), to: "/albums" }} />;

  const images = (album.data.images ?? []).map((image) => ({ image, src: albumImageSource(albumID, image) })).filter((item): item is typeof item & { src: string } => Boolean(item.src));
  return (
    <article className="content-page site-container album-detail">
      <Link className="back-link" to="/albums"><ArrowLeft aria-hidden="true" />{t("redesign.albums.back")}</Link>
      <header>
        <p className="code-label">photo_archive / {albumID}</p>
        <h1>{album.data.title}<span aria-hidden="true">.</span></h1>
        <div className="album-detail-meta">
          {album.data.date && <time>{album.data.date}</time>}
          <span>{t("redesign.albums.photoCount", { count: images.length })}</span>
        </div>
        {album.data.desc && <p>{album.data.desc}</p>}
      </header>
      {images.length ? (
        <section className="photo-grid">
          {images.map(({ image, src }, index) => (
            <button type="button" onClick={() => setActiveIndex(index)} key={image.id ?? src} aria-label={t("redesign.albums.openPhoto", { number: index + 1 })}>
              <img src={src} alt="" loading="lazy" />
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </section>
      ) : <div className="empty-gallery"><ImageIcon aria-hidden="true" /><p>{t("redesign.albums.empty")}</p></div>}
      <Lightbox open={activeIndex >= 0} close={() => setActiveIndex(-1)} index={Math.max(0, activeIndex)} slides={images.map(({ src }) => ({ src }))} />
    </article>
  );
}
