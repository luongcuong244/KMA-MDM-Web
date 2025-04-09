import React, { useState } from "react";
import styles from "./approve_topup_request_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import Converter from "../../utils/converter";
import moderatorTopupRequestManagementService from "../../services/moderator_topup_request_management_service";
import { useDispatch } from "react-redux";
import { fetchTopupRequestTableData } from "../../slices/topup_request_table_data.slice";

const ApproveTopupRequestDialog = ({ setShowDialog, topupRequests, userName, onSuccess }) => {

    const dispatch = useDispatch();

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSendingRequest) return;

        if (topupRequests.length === 0) {
            setWarning("Không có yêu cầu nạp tiền nào được chọn");
            return;
        }

        setWarning("");
        setIsSendingRequest(true);
        moderatorTopupRequestManagementService.approveTopupRequest(topupRequests.map((item) => item.id.originalValue))
            .then(() => {
                setShowDialog(false);
                onSuccess();
                // Refresh topup request table
                dispatch(fetchTopupRequestTableData({
                    pageNo: 1,
                    searchTerm: '',
                }));
            })
            .catch((err) => {
                let errorMessage = err?.response?.data?.message
                if (errorMessage) {
                    setWarning(errorMessage);
                } else {
                    setWarning("Đã có lỗi xảy ra!");
                }
            })
            .finally(() => {
                setIsSendingRequest(false);
            });
    };

    const totalMoney = topupRequests.reduce((acc, cur) => acc + cur.amount.originalValue, 0);

    const closeDialog = () => {
        setShowDialog(false);
    }

    return <Popup
        modal
        open
        overlayStyle={{ background: "#00000080" }}
        onClose={closeDialog}
        closeOnDocumentClick={false}
    >
        <div className={styles.formContainer}>
            <h2>Chấp nhận</h2>
            {
                warning &&
                <AlertError
                    text={warning}
                    style={{ marginBottom: 10 }}
                    textSize="0.875rem"
                    showIcon={false}
                />
            }
            <form onSubmit={handleSubmit}>
                <label>Bạn có chắc chắn muốn <b style={{color: "blue"}}>chấp nhận</b> yêu cầu nạp <i>{Converter.formatCurrency(totalMoney)}</i> của <b>{userName}</b> không?</label>
                <div className={styles.confirmButton} onClick={handleSubmit}>
                    {
                        isSendingRequest
                            ? <CircleLoader size="15px" strokeWidth="2px" color="transparent" />
                            : <label htmlFor="confirm">OK</label>
                    }
                </div>
            </form>
            <div className={styles.closeButton} onClick={closeDialog}>
                <IoCloseOutline color="#000" size={30} />
            </div>
        </div>
    </Popup>
}

export default ApproveTopupRequestDialog;