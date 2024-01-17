import { http } from './configURL';

const uploadService = {
  uploadCsv: async (formData) => {
    try {
      const data = await http.post(`/api/v1/scraper/google/uploads`, formData);
      return data?.data;
    } catch (err) {
      throw new Error(err);
    }
  },
  getUploadRecords: async (page = 1, pageSize = 10) => {
    try {
      const data = await http.get(`/api/v1/scraper/google/uploads/search?page=${page}&pageSize=${pageSize}`);
      return data?.data;
    } catch (err) {
      throw new Error(err);
    }
  },
}

export default uploadService;