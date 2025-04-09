import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/admin/account/";

class AdminAccountManagementService {

    async createNewUser(data) {
        return axiosApiInstance.post(API_URL + "create-new-user", data).then((res) => {
            return res.data;
        });
    }

    async getUsers(pageNo, pageSize, searchTerm) {
        return axiosApiInstance.get(API_URL + "get-users", {
            params: {
                pageNo,
                pageSize,
                searchTerm
            }
        }).then((res) => {
            return res.data;
        });
    }

    async changeUserPassword(userId, newPassword) {
        return axiosApiInstance.patch(API_URL + "change-user-password", {
            userId,
            newPassword
        }).then((res) => {
            return res.data;
        });
    }

    async blockUser({ userId, reason, unblockTime }) {
        return axiosApiInstance.post(API_URL + "block-user", {
            userId,
            reason,
            unblockTime
        });
    }

    async unblockUser(userId) {
        return axiosApiInstance.patch(API_URL + `unblock-user/${userId}`);
    }

    async fetchModeratorPermission(userId) {
        return axiosApiInstance.get(API_URL + "fetch-moderator-permission", {
            params: {
                userId
            }
        }).then((res) => {
            return res.data;
        });
    }

    async changeModeratorPermission(userId, permissions) {
        return axiosApiInstance.patch(API_URL + "change-moderator-permission", {
            userId,
            permissions
        }).then((res) => {
            return res.data;
        });
    }
}

export default new AdminAccountManagementService();