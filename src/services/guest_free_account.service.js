import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/public/";

class GuestFreeAccount {

    async getFreeAccount() {
        return axiosApiInstance.get(API_URL + "get-free-account").then((res) => {
            return res.data;
        });
    }
}

export default new GuestFreeAccount();