import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/configuration/";

class ConfigurationService {

    async getConfigurations(searchTerm) {
        return axiosApiInstance.get(API_URL + "get-all", {
            params: {
                searchTerm: searchTerm,
            },
        });
    }

    async getConfiguration(id) {
        return axiosApiInstance.get(API_URL + "get-configuration", {
            params: {
                id: id,
            },
        });
    }

    async saveConfiguration(data) {
        return axiosApiInstance.post(API_URL + "save-configuration", data);
    }
}

export default new ConfigurationService();
