import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { resolveApiAsset } from "../../api/client";
import { queryKeys } from "../../api/queryKeys";
import { getAlbumPreviews } from "../../api/queries/albums";
import { PageState } from "../../components/feedback/PageState";
import { PageIntro } from "../../components/layout/PageIntro";
import { albumKey, sortAlbums } from "./albumData";

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
                </div>
                <span className="album-index">{String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}</span>
                <h2>{album.title}</h2>
                {album.date && <time>{album.date}</time>}
                {album.desc && <p>{album.desc}</p>}
                <span>{t("portfolio.albums.photoCount", { count: album.image_count ?? 0 })}</span>
              </Link>
            );
          })}
        </section>
      ) : <p className="inline-state">{t("portfolio.common.empty")}</p>}
    </article>
  );
}
