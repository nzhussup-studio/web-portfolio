/**
 * Utility functions for managing URL query parameters
 */

const DEFAULTS = {
  lang: "en",
  mode: "light",
};

/**
 * Builds a URL with query parameters, only including non-default values
 * @param {string} pathname - The path for the URL (can include hash fragment)
 * @param {Object} params - Object containing query parameters
 * @returns {string} The built URL with query string and hash if needed
 */
export const buildUrl = (pathname, params = {}) => {
  // Split pathname and hash fragment
  const [path, hash] = pathname.split("#");

  const searchParams = new URLSearchParams();

  // Only add non-default parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== DEFAULTS[key]) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  let url = queryString ? `${path}?${queryString}` : path;

  // Re-append hash fragment if it exists
  if (hash) {
    url += `#${hash}`;
  }

  return url;
};

/**
 * Gets all current query parameters from the URL
 * @returns {Object} Object containing all query parameters
 */
export const getCurrentParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

/**
 * Updates a specific query parameter while preserving others and hash
 * @param {string} key - The parameter key to update
 * @param {string} value - The new value for the parameter
 * @returns {string} The new URL search string
 */
export const updateParam = (key, value) => {
  const currentParams = getCurrentParams();

  // Update the specific parameter
  if (value === DEFAULTS[key]) {
    // Remove if it's the default value
    delete currentParams[key];
  } else {
    currentParams[key] = value;
  }

  // Preserve hash fragment
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  return buildUrl(pathname + hash, currentParams);
};

/**
 * Gets the value of a specific query parameter or returns default
 * @param {string} key - The parameter key
 * @returns {string} The parameter value or default
 */
export const getParam = (key) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key) || DEFAULTS[key];
};
