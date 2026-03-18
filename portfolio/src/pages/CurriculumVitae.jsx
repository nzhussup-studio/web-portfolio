import React, { useState, useEffect } from "react";
import UpButton from "../components/UpButton";
import CVSubNavbar from "../components/CVSubNavbar";
import SectionList from "../components/SectionList";
import SkillBadge from "../components/SkillBadge";
import Card from "../components/Card";
import { fetchData } from "../utils/apiUtil";
import Loading from "./waiting/Loading";
import { formatDate } from "../utils/utilFunctions";
import config from "../config/AppConfig";
import PageWrapper from "../utils/SmoothPage";
import Unavailable from "./exceptions/Unavailable";

const CurriculumVitae = ({ isDarkMode, t }) => {
  const [workExperience, setWorkExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const [fetchErrors, setFetchErrors] = useState({
    workExperience: false,
    education: false,
    skills: false,
    certifications: false,
  });

  const allFetchErrors = Object.values(fetchErrors).every(
    (value) => value === true,
  );

  const WorkIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-briefcase'
      viewBox='0 0 16 16'
    >
      <path d='M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5' />
    </svg>
  );

  const EducationIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-book'
      viewBox='0 0 16 16'
    >
      <path d='M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783' />
    </svg>
  );

  const SkillIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-braces'
      viewBox='0 0 16 16'
    >
      <path d='M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6' />
    </svg>
  );

  const CertIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-file-richtext'
      viewBox='0 0 16 16'
    >
      <path d='M7 4.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m-.861 1.542 1.33.886 1.854-1.855a.25.25 0 0 1 .289-.047l1.888.974V7.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V7s1.54-1.274 1.639-1.208M5 9a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z' />
      <path d='M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1' />
    </svg>
  );

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setShowLoading(false);
      const delayTimeout = setTimeout(() => {
        setShowLoading(true);
      }, config.variables.loadingTimeout);

      setFetchErrors({
        workExperience: false,
        education: false,
        skills: false,
        certifications: false,
      });

      try {
        const [workData, educationData, skillsData, certData] =
          await Promise.allSettled([
            fetchData(config.api.personal.endpoints.work_experience),
            fetchData(config.api.personal.endpoints.education),
            fetchData(config.api.personal.endpoints.skills),
            fetchData(config.api.personal.endpoints.certifications),
          ]);

        if (workData.status === "fulfilled") setWorkExperience(workData.value);
        else setFetchErrors((prev) => ({ ...prev, workExperience: true }));

        if (educationData.status === "fulfilled")
          setEducation(educationData.value);
        else setFetchErrors((prev) => ({ ...prev, education: true }));

        if (skillsData.status === "fulfilled") setSkills(skillsData.value);
        else setFetchErrors((prev) => ({ ...prev, skills: true }));

        if (certData.status === "fulfilled") setCertifications(certData.value);
        else setFetchErrors((prev) => ({ ...prev, certifications: true }));
      } finally {
        clearTimeout(delayTimeout);
        setShowLoading(false);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Scroll to hash section when page loads or hash changes
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1); // Remove the '#'
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    if (!loading) {
      // Delay to account for page animation (500ms) plus render time
      setTimeout(scrollToHash, 600);
    }

    // Listen for hash changes
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [loading]);

  if (loading && showLoading) {
    return <Loading t={t} />;
  }

  if (allFetchErrors) {
    return <Unavailable t={t} />;
  }

  const PageContent = (
    <PageWrapper>
      <SectionList
        id='work-experience'
        title='cv_page.navigations.work_experience'
        data={fetchErrors.workExperience ? [] : workExperience}
        renderItem={(work, index) => (
          <Card
            key={index}
            title={`${work.position} at ${work.company}`}
            description={work.description}
            location={work.location}
            duration={`${work.startDate} to ${
              work.endDate ? work.endDate : "present"
            }`}
            isDarkMode={isDarkMode}
          >
            {work.techStack && (
              <p className='text-muted'>
                <strong>Tech Stack:</strong>
                <div className='d-flex flex-wrap gap-2 mt-2'>
                  {work.techStack.split(", ").map((name, idx) => (
                    <SkillBadge
                      key={idx}
                      skill={name}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </p>
            )}
          </Card>
        )}
        isDarkMode={isDarkMode}
        emptyMessage={
          fetchErrors.workExperience
            ? t("cv_page.errors.work_experience")
            : t("cv_page.empty.work_experience")
        }
        t={t}
        icon={WorkIcon}
      />

      <SectionList
        id='education'
        title='cv_page.navigations.education'
        data={fetchErrors.education ? [] : education}
        renderItem={(edu, index) => {
          const startDate = new Date(edu.startDate);
          const endDate = edu.endDate ? new Date(edu.endDate) : "present";
          const duration = `From ${formatDate(startDate)} to ${
            endDate === "present" ? "present" : formatDate(endDate)
          }`;

          return (
            <Card
              key={index}
              title={`${edu.degree} at ${edu.institution}`}
              description={edu.thesis ? edu.thesis : ""}
              location={edu.location}
              isDarkMode={isDarkMode}
              duration={duration}
            >
              {edu.description && (
                <p className='text-muted'>{edu.description}</p>
              )}
            </Card>
          );
        }}
        isDarkMode={isDarkMode}
        emptyMessage={
          fetchErrors.education
            ? t("cv_page.errors.education")
            : t("cv_page.empty.education")
        }
        t={t}
        icon={EducationIcon}
      />

      <SectionList
        id='skills'
        title='cv_page.navigations.skills'
        data={fetchErrors.skills ? [] : skills}
        renderItem={(skill, index) => (
          <div key={index} className='card mb-3 shadow-sm rounded-lg'>
            <div className='card-body'>
              <h5 className='card-title text-body-emphasis mb-2'>
                {skill.category}
              </h5>
              <div className='d-flex flex-wrap gap-2'>
                {skill.skillNames.split(", ").map((name, idx) => (
                  <SkillBadge key={idx} skill={name} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>
          </div>
        )}
        isDarkMode={isDarkMode}
        emptyMessage={
          fetchErrors.skills
            ? t("cv_page.errors.skills")
            : t("cv_page.empty.skills")
        }
        t={t}
        icon={SkillIcon}
      />

      <SectionList
        id='certifications'
        title='cv_page.navigations.certifications'
        data={fetchErrors.certifications ? [] : certifications}
        renderItem={(cert, index) => (
          <Card
            key={index}
            title={cert.name}
            link={cert.url}
            linkText={t("cv_page.buttons.view_cert")}
            isDarkMode={isDarkMode}
          />
        )}
        isDarkMode={isDarkMode}
        emptyMessage={
          fetchErrors.certifications
            ? t("cv_page.errors.certifications")
            : t("cv_page.empty.certifications")
        }
        t={t}
        icon={CertIcon}
      />
    </PageWrapper>
  );

  return (
    <div className='container mt-4'>
      <h1 className='pb-2 border-bottom text-center'>{t("cv_page.title")}</h1>
      <UpButton isDarkMode={isDarkMode} />
      <CVSubNavbar isDarkMode={isDarkMode} t={t} />
      {loading ? "" : PageContent}
    </div>
  );
};

export default CurriculumVitae;
