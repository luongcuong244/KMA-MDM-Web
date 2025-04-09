import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/user/";

class UserService {

  async getCurrentUser() {
    return axiosApiInstance.get(API_URL + "get-current-info").then((res) => {
      console.log(res.data);
      if (res.data && res.data.message) {
        return null;
      } else {
        return res.data;
      }
    });
  }
}

export default new UserService();
