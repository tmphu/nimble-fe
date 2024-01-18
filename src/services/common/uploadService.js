import { http } from './configURL';

const uploadService = {
  uploadCsv: async (formData) => {
    try {
      const data = await http.post(`/api/v1/scraper/google/uploads`, formData);
      return data?.data;
    } catch (err) {
      throw err.response?.data;
    }
  },
  getUploadRecords: async (page = 1, pageSize = 10, searchStr) => {
    try {
      let reqUrl = `/api/v1/scraper/google/uploads/search?page=${page}&pageSize=${pageSize}`;
      searchStr && (reqUrl += `&search=${searchStr}`);
      const data = await http.get(reqUrl);
      return data?.data;
    } catch (err) {
      throw err.response?.data;
    }
  },
  getResultRecords: async (page = 1, pageSize = 10, searchStr) => {
    try {
      let reqUrl = `/api/v1/scraper/google/results/search?page=${page}&pageSize=${pageSize}`;
      searchStr && (reqUrl += `&search=${searchStr}`);
      const data = await http.get(reqUrl);
      return data?.data;
    } catch (err) {
      throw err.response?.data;
    }
  },
}

export default uploadService;