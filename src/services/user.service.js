import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/user/";

class UserService {

  async getCurrentUser() {
    return axiosApiInstance.get(API_URL + "get-info").then((res) => {
      if (res.data && res.data.message) {
        return null;
      } else {
        return res.data;
      }
    });
  }

  async getTopupRequests() {
    return axiosApiInstance.get(API_URL + "get-topup-requests").then((res) => {
      return res.data;
    });
  }

  async createTopupRequest(amount) {
    return axiosApiInstance.post(API_URL + "create-topup-request", amount).then((res) => {
      return res.data;
    });
  }

}

export default new UserService();
