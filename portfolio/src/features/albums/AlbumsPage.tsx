import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { queryKeys, resolveApiAsset } from "@/api";
import { getAlbumPreviews } from "@/api/queries";
import { PageState } from "@/components/feedback/page-state";
import { InlineState } from "@/components/feedback/inline-state";
import { PageIntro } from "@/components/layout/page-intro";
import { albumKey, sortAlbums } from "./albumData";
import "./AlbumsPage.css";

export function AlbumsPage() {
  const { t } = useTranslation();
  const albums = useQuery({ queryKey: queryKeys.albums.list, queryFn: getAlbumPreviews });

  if (albums.isPending) return <PageState eyebrow="photo_archive / 04" title={t("portfolio.common.loading")} />;
  if (albums.isError) return <PageState eyebrow="photo_archive / 04" title={t("portfolio.common.errorTitle")} message={t("portfolio.common.errorText")} action={{ label: t("portfolio.common.retry"), onClick: () => void albums.refetch() }} />;

  const ordered = sortAlbums(albums.data);
  const layout = ordered.length >= 5 ? "many" : String(ordered.length);
  return (
    <article className="content-page site-container">
      <PageIntro eyebrow="photo_archive / 04" title={t("portfolio.albums.title")} description={t("portfolio.albums.description")} />
      {ordered.length ? (
        <section className={`album-grid album-grid-${layout}`} aria-label={t("portfolio.albums.title")}>
          {ordered.map((album, index) => {
            const image = resolveApiAsset(album.preview_image);
            return (
              <Link className="album-preview" to={`/albums/${encodeURIComponent(album.id ?? "")}`} key={albumKey(album, index)}>
                <div className="album-cover">
                  {image ? <img src={image} alt="" /> : <ImageIcon aria-hidden="true" />}
                  <div className="album-card-copy">
                    <span className="album-index">{String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}</span>
                    <h2>{album.title}</h2>
                    <span className="album-card-details">
                      {album.date && <time>{album.date}</time>}
                      <span>{t("portfolio.albums.photoCount", { count: album.image_count ?? 0 })}</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      ) : <InlineState>{t("portfolio.common.empty")}</InlineState>}
    </article>
  );
}
