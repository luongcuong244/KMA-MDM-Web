import React, { useState } from "react";
import styles from "./reject_topup_request_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import Converter from "../../utils/converter";
import moderatorTopupRequestManagementService from "../../services/moderator_topup_request_management_service";
import { useDispatch } from "react-redux";
import { fetchTopupRequestTableData } from "../../slices/topup_request_table_data.slice";

const RejectTopupRequestDialog = ({ setShowDialog, topupRequests, userName, onSuccess }) => {

    const dispatch = useDispatch();

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [reason, setReason] = useState('');

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            setWarning("Vui lòng nhập lý do từ chối!");
            return;
        }

        if (isSendingRequest) {
            return;
        }

        const params = {
            topupRequestIds: topupRequests.map((request) => request.id.originalValue),
            reason: reason.trim()
        };

        console.log(params);

        setWarning("");
        setIsSendingRequest(true);
        moderatorTopupRequestManagementService.rejectTopupRequest(params)
            .then(() => {
                setShowDialog(false);
                onSuccess();
                // Refresh topup request table
                dispatch(fetchTopupRequestTableData({
                    pageNo: 1,
                    searchTerm: '',
                }));
            })
            .catch((error) => {
                let errorMessage = error?.response?.data?.message
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
            <h2>Từ chối</h2>
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
                <label>Bạn có chắc chắn muốn <b style={{ color: "red" }}>từ chối</b> yêu cầu nạp <i>{Converter.formatCurrency(totalMoney)}</i> của <b>{userName}</b> không?</label>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Lý do</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            id="reason"
                            placeholder="Nhập lý do"
                            value={reason}
                            onChange={handleReasonChange}
                            disabled={isSendingRequest}
                        />
                    </div>
                </div>
                <div className={styles.confirmButton} onClick={handleSubmit}>
                    {
                        isSendingRequest
                            ? <CircleLoader size="15px" strokeWidth="2px" color="transparent" />
                            : <label htmlFor="confirm">Tôi chắc</label>
                    }
                </div>
            </form>
            <div className={styles.closeButton} onClick={closeDialog}>
                <IoCloseOutline color="#000" size={30} />
            </div>
        </div>
    </Popup>
}

export default RejectTopupRequestDialog;