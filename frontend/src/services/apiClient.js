export const apiClient = {
  get: async (url) => {
    // Mock GET request
    console.log(`GET ${url}`);
    return Promise.resolve({ data: {} });
  },
  post: async (url, body) => {
    // Mock POST request
    console.log(`POST ${url}`, body);
    return Promise.resolve({ data: {} });
  },
};
