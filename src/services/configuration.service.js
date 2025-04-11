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
}

export default new ConfigurationService();
