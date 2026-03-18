import axios from "axios";
import config from "../config/AppConfig";

/**
 * Fetch data from the given API endpoint.
 * @param {string} endpoint - The endpoint to fetch data from (e.g., 'work-experience').
 * @returns {Promise<Array>} - A promise that resolves to the fetched data.
 */
export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(
      `${config.api.personal.base_url}/${endpoint}`
    );
    return response.data.sort((a, b) => b.displayOrder - a.displayOrder);
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchDataWithoutSort = async (endpoint) => {
  try {
    const response = await axios.get(
      `${config.api.personal.base_url}/${endpoint}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchRepoDescription = async (url) => {
  const repoName = url.split("/").slice(-2).join("/");
  const repoUrl = `${config.api.github.base_url}/${repoName}`;
  const token = config.api.github.token;

  if (!token) {
    console.error("GitHub token not available.");
    return "GitHub token not available.";
  }

  try {
    const response = await fetch(repoUrl, {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.description || "No description available.";
  } catch (error) {
    console.error("Error fetching repository description:", error);
    return "Failed to fetch repository description.";
  }
};

export const fetchSummary = async (lang) => {
  try {
    const response = await axios.get(
      `${config.api.personal.base_url}/llm/summarize?lang=${lang}`
    );
    return response.data["message"];
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    throw error;
  }
};
