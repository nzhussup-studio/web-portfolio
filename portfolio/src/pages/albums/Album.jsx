import React, { useState, useEffect } from "react";
import { fetchDataWithoutSort } from "../../utils/apiUtil";
import UpButton from "../../components/UpButton";
import Loading from "../waiting/Loading";
import Unavailable from "../exceptions/Unavailable";
import NotFound from "../exceptions/NotFound";
import config from "../../config/AppConfig";
import PageWrapper from "../../utils/SmoothPage";
import { useParams } from "react-router-dom";
import AlbumCard from "../../components/AlbumCard"; // Import the AlbumCard component

const Album = ({ isDarkMode, t }) => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { albumID } = useParams();

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      setShowLoading(false);
      setFetchError(false);
      setNotFound(false);

      const delayTimeout = setTimeout(() => {
        setShowLoading(true);
      }, config.variables.loadingTimeout);

      try {
        const fetchedAlbum = await fetchDataWithoutSort(
          config.api.personal.endpoints.albums + `/${albumID}`
        );
        console.log("Fetched album:", fetchedAlbum);
        setAlbum(fetchedAlbum.data);
      } catch (error) {
        if (error.status === 404) {
          setNotFound(true);
        } else {
          setFetchError(true);
          console.error("Error fetching album:", error);
        }
      } finally {
        clearTimeout(delayTimeout);
        setShowLoading(false);
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [albumID]);

  if (loading && showLoading) return <Loading t={t} />;
  if (notFound) return <NotFound t={t} />;
  if (fetchError) return <Unavailable t={t} />;
  if (!album) return null;
  if (album.images.length === 0) {
    return (
      <div className='container px-4 py-5' id='album-detail'>
        <UpButton isDarkMode={isDarkMode} />
        <h2 className='pb-2 border-bottom'>
          {album.title}
          {album.date ? `(${album.date})` : ""}
        </h2>
        <p className='text-muted'>{album.desc}</p>
        <PageWrapper>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{t("albums_page.empty.album.title")}</h1>
            <p>{t("albums_page.empty.album.description")}</p>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className='container px-4 py-5' id='album-detail'>
      <UpButton isDarkMode={isDarkMode} />
      <h2 className='pb-2 border-bottom'>
        {album.title}
        {` ${album.date ? `(${album.date})` : ""}`}
      </h2>
      <p className='text-muted'>{album.desc}</p>
      <PageWrapper>
        <AlbumCard images={album.images} isDarkMode={isDarkMode} />
      </PageWrapper>
    </div>
  );
};

export default Album;
