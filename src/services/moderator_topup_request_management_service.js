import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/moderator/topup-request/";

class ModeratorTopupRequestManagementService {

    async getTopupRequests(pageNo, pageSize, searchTerm) {
        return axiosApiInstance.get(API_URL + "get-topup-requests", {
            params: {
                pageNo,
                pageSize,
                searchTerm
            }
        }).then((res) => {
            return res.data;
        });
    }

    async rejectTopupRequest(params) {
        return axiosApiInstance.post(API_URL + "reject-topup-requests", params).then((res) => {
            return res.data;
        });
    }

    async approveTopupRequest(topupRequestIds) {
        return axiosApiInstance.patch(API_URL + "approve-topup-requests", topupRequestIds).then((res) => {
            return res.data;
        });
    }

    async getTopupRequestHistory(params) {
        return axiosApiInstance.get(API_URL + "get-topup-request-history", {
            params
        }).then((res) => {
            return res.data;
        });
    }
}

export default new ModeratorTopupRequestManagementService();