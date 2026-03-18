import React, { useState, useEffect } from "react";
import { fetchData, fetchRepoDescription } from "../utils/apiUtil";
import UpButton from "../components/UpButton";
import Loading from "./waiting/Loading";
import Unavailable from "./exceptions/Unavailable";
import config from "../config/AppConfig";
import PageWrapper from "../utils/SmoothPage";

const Projects = ({ isDarkMode, t }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setShowLoading(false);

      const delayTimeout = setTimeout(() => {
        setShowLoading(true);
      }, config.variables.loadingTimeout);

      setFetchError(false);

      try {
        const fetchedProjects = await fetchData(
          config.api.personal.endpoints.projects
        );

        const projectsWithDetails = await Promise.all(
          fetchedProjects.map(async (project) => {
            try {
              const description = await fetchRepoDescription(project.url);

              return {
                ...project,
                description,
              };
            } catch (error) {
              console.error(
                `Error fetching details for project ${project.name}:`,
                error
              );
              return { ...project, description: "Error fetching description" };
            }
          })
        );

        setProjects(projectsWithDetails);
      } catch (error) {
        setFetchError(true);
        console.error("Error fetching projects:", error);
      } finally {
        clearTimeout(delayTimeout);
        setShowLoading(false);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading && showLoading) {
    return <Loading t={t} />;
  }

  if (fetchError) {
    return <Unavailable t={t} />;
  }

  const PageContent = (
    <PageWrapper>
      <div className='row g-4 py-5 row-cols-1 row-cols-sm-2 row-cols-md-2'>
        {projects.map((project, index) => {
          const techStackArray = project.techStack
            ? project.techStack.split(",").map((tech) => tech.trim())
            : [];

          return (
            <div className='col d-flex align-items-start' key={index}>
              <div className='icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
                  fill='currentColor'
                  className='bi bi-code-slash'
                  viewBox='0 0 16 16'
                >
                  <path d='M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0' />
                </svg>
              </div>
              <div>
                <h3 className='fs-2 text-body-emphasis'>{project.name}</h3>
                <p>{project.description}</p>
                <div className='d-flex flex-wrap gap-2 mt-2'>
                  {techStackArray.length > 0 ? (
                    techStackArray.map((tech, idx) => (
                      <span
                        key={idx}
                        className={`badge ${
                          isDarkMode
                            ? "bg-secondary text-white"
                            : "bg-light text-black"
                        } rounded-pill`}
                        style={{ fontSize: "14px" }}
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span
                      className={`badge ${
                        isDarkMode
                          ? "bg-secondary text-white"
                          : "bg-light text-muted"
                      } rounded-pill`}
                      style={{ fontSize: "14px" }}
                    >
                      No tech stack available
                    </span>
                  )}
                </div>

                <a
                  href={project.url}
                  className={`btn ${
                    isDarkMode ? "btn-secondary text-white" : "btn-dark"
                  } mt-3`}
                >
                  {t("projects_page.source_code_button")}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );

  return (
    <div className='container px-4 py-5' id='hanging-icons'>
      <UpButton isDarkMode={isDarkMode} />
      <h2 className='pb-2 border-bottom'>{t("projects_page.title")}</h2>
      {loading ? "" : PageContent}
    </div>
  );
};

export default Projects;
