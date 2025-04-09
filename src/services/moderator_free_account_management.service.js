import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/moderator/free-account/";

class ModeratorFreeAccountManagementService {

    async getFreeAccount(params) {
        return axiosApiInstance.get(API_URL + "get-free-account", { params }).then((res) => {
            return res.data;
        });
    }

    async updateFreeAccount(requestBody) {
        return axiosApiInstance.post(API_URL + "update-free-account", requestBody).then((res) => {
            return res.data;
        });
    }
}

export default new ModeratorFreeAccountManagementService();