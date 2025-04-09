import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/moderator/played-time/";

class ModeratorPlayedTimeManagementService {

    async getPlayedTime(params) {
        return axiosApiInstance.get(API_URL + "get-played-time", { params }).then((res) => {
            return res.data;
        });
    }

    async updatePlayedTime(requestBody) {
        return axiosApiInstance.post(API_URL + "update-played-time", requestBody).then((res) => {
            return res.data;
        });
    }
}

export default new ModeratorPlayedTimeManagementService();