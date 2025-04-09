import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/api/admin/voucher/";

class AdminVoucherManagementService {

    async createNewVoucher(data) {
        return axiosApiInstance.post(API_URL + "create-new-voucher", data).then((res) => {
            return res.data;
        });
    }

    async getVouchers(pageNo, pageSize) {
        return axiosApiInstance.get(API_URL + "get-vouchers", {
            params: {
                pageNo,
                pageSize
            }
        }).then((res) => {
            return res.data;
        });
    }
}

export default new AdminVoucherManagementService();