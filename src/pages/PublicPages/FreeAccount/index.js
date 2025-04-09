import React, { useEffect } from "react";
import styles from "./free_account.module.scss";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchFreeAccountForGuest, selectFreeAccountForGuest } from "../../../slices/guest_fetch_free_account.slice";
import * as moment from 'moment'
import Loader from "../../../components/Loader";

const FreeAccount = () => {

    const dispatch = useDispatch();
    const freeAccountForGuest = useSelector(selectFreeAccountForGuest);

    useEffect(() => {
        dispatch(fetchFreeAccountForGuest());
    }, []);

    return <div id={styles.freeAccountContainer}>
        <label className={styles.neonText}>Tài khoản miễn phí</label>
        <p className={styles.freeAccountDescription}>
            Tài khoản miễn phí là tài khoản mà bạn có thể sử dụng để đăng nhập vào máy trạm mà không cần phải trả bất kỳ khoản phí nào.
        </p>
        <div className={clsx(styles.block, styles.glow)}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tài khoản</th>
                            <th>Mật khẩu</th>
                            <th>Số giờ chơi</th>
                            <th>Thời gian đăng nhập</th>
                            <th>Ngày</th>
                        </tr>
                    </thead>
                    {
                        freeAccountForGuest.data && freeAccountForGuest.data.length > 0 && (
                            <tbody>
                                {
                                    freeAccountForGuest.data.map((item, index) => {

                                        const startTimeAllowedToLogin = new Date(item.startTimeAllowedToLogin);
                                        const endTimeAllowedToLogin = new Date(item.endTimeAllowedToLogin);

                                        let timeString = "";
                                        const decimalTime = (item.timeToUseInMinutes / 60).toFixed(1);

                                        if (decimalTime.endsWith('.0')) {
                                            timeString = parseInt(decimalTime) + " giờ";
                                        } else {
                                            timeString = decimalTime + " giờ";
                                        }

                                        return <tr key={index}>
                                            <td>{item.accountName}</td>
                                            <td>{item.password}</td>
                                            <td>{timeString}</td>
                                            <td>{moment(startTimeAllowedToLogin).format("HH:mm")} đến {moment(endTimeAllowedToLogin).format("HH:mm")}</td>
                                            <td>{moment(startTimeAllowedToLogin).format("DD-MM-YYYY")}</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        )
                    }
                </table>
                {
                    freeAccountForGuest.data && freeAccountForGuest.data.length == 0 && (
                        <div className={clsx(styles.emptyList, styles.noData)}>
                            Hiện tại chưa có tài khoản miễn phí nào.
                        </div>
                    )
                }
                {
                    freeAccountForGuest.isLoading && (
                        <div className={styles.emptyList}>
                            <Loader color="#fff" width="30px" />
                            <span className={styles.loading} >Đang lấy dữ liệu...</span>
                        </div>
                    )
                }
                {
                    freeAccountForGuest.errorMessage && (
                        <div className={clsx(styles.emptyList, styles.errorMessage)}>
                            {freeAccountForGuest.errorMessage}
                        </div>
                    )
                }
            </div>
        </div>
    </div>
}

export default FreeAccount;