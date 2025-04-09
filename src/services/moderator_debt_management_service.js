import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/moderator/debt-management/";

class ModeratorDebtManagementService {

    async getDebts(params) {
        return axiosApiInstance.get(API_URL + "get-debts", {
            params
        }).then((res) => {
            return res.data;
        });
    }

    async deleteDebt(debtId) {
        return axiosApiInstance.patch(API_URL + `delete-debt-by-id/${debtId}`)
            .then((res) => {
                return res.data;
            }
        );
    }

    async restoreDebt(debtId) {
        return axiosApiInstance.patch(API_URL + `restore-debt-by-id/${debtId}`)
            .then((res) => {
                return res.data;
            }
        );
    }

    async updateDebt(data) {
        return axiosApiInstance.post(API_URL + "update-debt", data)
            .then((res) => {
                return res.data;
            }
        );
    }
}

export default new ModeratorDebtManagementService();