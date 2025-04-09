import CONSTANT from "../utils/constant";
import axiosApiInstance from "../config/axios.instance.config";
import Cookies from "universal-cookie";
import { store } from "../redux/store";
import { setUser } from "../slices/user.slice";

const cookies = new Cookies();

const API_URL = CONSTANT.baseUrl + "/auth/";

class AuthService {

    async signIn(userName, password) {
        return axiosApiInstance.post(API_URL + "sign-in", {
          userName,
          password,
        }).then((response) => {
            return response;
        });
    }

    async signOut() {
        return axiosApiInstance.post(API_URL + "sign-out")
        .then(() => {
            store.dispatch(setUser(null));
        })
        .catch((err) => {
            let errorMessage = err.response?.data?.message;
            if (!errorMessage) {
                errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau."
            }
            alert(errorMessage);
        });
    }
}

export default new AuthService();