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

    async editApplication(data) {
        return axiosApiInstance.post(API_URL + "edit-application", data);
    }

    async getApplication(packageName) {
        return axiosApiInstance.get(API_URL + "get-application", {
            params: {
                packageName: packageName,
            },
        });
    }

    async addApkVersion(data) {
        return axiosApiInstance.post(API_URL + "add-apk-version", data);
    }

    async deleteApkVersion(data) {
        return axiosApiInstance.post(API_URL + "delete-apk-version", data);
    }

    async getAvailableApplicationForConfig(data) {
        return axiosApiInstance.post(API_URL + "get-available-application-for-config", data);
    }

    async deleteApplication(packageName) {
        return axiosApiInstance.post(API_URL + "delete-application", {
            packageName: packageName,
        });
    }
}

export default new ApplicationService();