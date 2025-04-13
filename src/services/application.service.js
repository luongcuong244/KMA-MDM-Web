import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/application/";

class ApplicationService {

    async getApplications(searchTerm) {
        return axiosApiInstance.get(API_URL + "get-all", {
            params: {
                searchTerm: searchTerm,
            },
        });
    }

    async getAppIcon() {
        return axiosApiInstance.get(API_URL + "get-app-icon");
    }

    async addAppIcon(data) {
        return axiosApiInstance.post(API_URL + "add-app-icon", data);
    }

    async addApplication(data) {
        return axiosApiInstance.post(API_URL + "add-application", data);
    }
}

export default new ApplicationService();