export const ENV = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://www.coople.com/ch/resources/api/',
  COOPLE_JOBS_API: process.env.REACT_APP_COOPLE_JOBS_API || 'https://www.coople.com/ch/resources/api/work-assignments/public-jobs/',
} as const; 