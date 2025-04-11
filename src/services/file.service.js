import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";

const API_URL = CONSTANT.baseUrl + "/file/";

class FileService {

    async uploadApk(formData) {
        return axiosApiInstance.post(API_URL + "upload-apk", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    async cancelUpload(filePath) {
        return axiosApiInstance.post(API_URL + "cancel-upload", {
            filePath,
        });
    }
}

export default new FileService();