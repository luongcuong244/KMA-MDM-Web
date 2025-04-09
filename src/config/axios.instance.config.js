import axios from "axios";
import CONSTANT from "../utils/constant";
import { setSignOutDialogShowing, setBlockUserDialogShowing } from "../slices/modal_appearance.slice";
import API_ERROR from "../enums/apierror.enum";
import { store } from "../redux/store";
import { setUser } from "../slices/user.slice";

const axiosApiInstance = axios.create({
  baseURL: CONSTANT.baseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosApiInstance.defaults.withCredentials = true;

axiosApiInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error?.config;
    const url = config?.url;

    if (!url) {
      return Promise.reject(error);
    }

    const errorMessage = error?.response?.data?.error;

    if (
      url.indexOf("/auth") >= 0 &&
      url.indexOf("/auth/refresh-token") < 0
    ) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && errorMessage) {
      if (errorMessage === API_ERROR.expiredRefreshToken) {
        
        if (url.indexOf("/user/get-info") >= 0) {
          return;
        }

        store.dispatch(setUser(null));
        store.dispatch(setSignOutDialogShowing({ isSignOutDialogShowing: true }));
      }

      // show dialog if user is blocked
      if (errorMessage === API_ERROR.userIsBlocked) {
        console.log("user is blocked");
        store.dispatch(setUser(null));
        store.dispatch(setBlockUserDialogShowing({ isBlockUserDialogShowing: true }));
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosApiInstance;