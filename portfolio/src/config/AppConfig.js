const config = {
  about_me: {
    name: "Nurzhanat Zhussup",
    position: "Software Engineer | ex Data Scientist",
    current_position: "Software Engineer @ Senacor Technologies AG",
  },
  api: {
    personal: {
      api_url: "https://api.nzhussup.com",
      base_url: "https://api.nzhussup.com/v1", 
      endpoints: {
        work_experience: "base/work-experience",
        education: "base/education",
        projects: "base/project",
        skills: "base/skill",
        certifications: "base/certificate",
        albums: "album",
      }
    },
    github: {
      base_url: "https://api.github.com/repos",
      token: import.meta.env.VITE_GITHUB_TOKEN
    }
  },
  variables: {
    loadingTimeout: 200,
  },
};

export default config;
  