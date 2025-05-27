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

  async changePassword(oldPassword, newPassword) {
    return axiosApiInstance.post(API_URL + "change-password", {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  async getAllUsers() {
    return axiosApiInstance.get(API_URL + "get-all-users");
  }

  async createUser(user) {
    return axiosApiInstance.post(API_URL + "create-user", user);
  }
  async updateUser(user) {
    return axiosApiInstance.post(API_URL + "update-user", user);
  }

  async changeUserPassword(data) {
    return axiosApiInstance.post(API_URL + "change-user-password", data);
  }

  async lockUser(data) {
    return axiosApiInstance.post(API_URL + "lock-user", data);
  }

  async unlockUser(userId) {
    return axiosApiInstance.post(API_URL + "unlock-user", { userId: userId });
  }
}

export default new UserService();
