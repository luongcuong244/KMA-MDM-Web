import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/device/";

class DeviceService {

    async getDeviceList() {
        return axiosApiInstance.get(API_URL + "get-device-list");
    }

    async getDeviceById(deviceId) {
        return axiosApiInstance.get(API_URL + "get-device-by-id", {
            params: {
                deviceId: deviceId
            }
        });
    }
    
    async addNewDevice(data) {
        return axiosApiInstance.post(API_URL + "add-new-device", data);
    }
}

export default new DeviceService();