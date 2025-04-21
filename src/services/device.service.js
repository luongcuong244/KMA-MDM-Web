import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/device/";

class DeviceService {

    async getDeviceList() {
        return axiosApiInstance.get(API_URL + "get-device-list");
    }
    
    async addNewDevice(data) {
        return axiosApiInstance.post(API_URL + "add-new-device", data);
    }
}

export default new DeviceService();