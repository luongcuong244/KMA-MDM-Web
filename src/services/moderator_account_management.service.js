import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/moderator/account/";

class ModeratorAccountManagementService {

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

    async getUserInfo(userId) {
        return axiosApiInstance.get(API_URL + `get-user-info/${userId}`).then((res) => {
            return res.data;
        });
    }

    async updateUserInfo(userId, data) {
        return axiosApiInstance.patch(API_URL + `update-user-info/${userId}`, data).then((res) => {
            return res.data;
        });
    }

    async getDebts(userId) {
        return axiosApiInstance.get(API_URL + `get-debts/${userId}`).then((res) => {
            return res.data;
        });
    }

    async createNewDebt(data) {
        return axiosApiInstance.post(API_URL + "create-new-debt", data).then((res) => {
            return res.data;
        });
    }

    async confirmDebtPayment(data) {
        return axiosApiInstance.post(API_URL + "confirm-debt-payment", data).then((res) => {
            return res.data;
        });
    }
}

export default new ModeratorAccountManagementService();