import React, { useState } from "react";
import styles from "./edit_debt_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import { NumericFormat } from 'react-number-format';
import DatePicker from "react-datepicker";
import moderatorDebtManagementService from "../../services/moderator_debt_management_service";

const EditDebtDialog = ({ setShowDialog, debt, onUpdateSuccessfully }) => {

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [amount, setAmount] = useState(debt.amountOwed);
    const [owedDate, setOwedDate] = useState(new Date(debt.owedDate));
    const [description, setDescription] = useState(debt.description);

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (amount < 1000) {
            return setWarning("Số tiền nợ phải lớn hơn 1000đ");
        }

        if (!owedDate || !description.trim()) {
            return setWarning("Vui lòng nhập đầy đủ thông tin");
        }

        setWarning("");

        setIsSendingRequest(true);
        moderatorDebtManagementService.updateDebt({
            debtId: debt.debtId,
            owedAmount: amount,
            owedDate: owedDate.getTime(),
            description: description
        })
            .then(() => {
                setShowDialog(false);
                onUpdateSuccessfully();
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
            <h2>{`Sửa khoản nợ`}</h2>
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
                <div className={styles.formGroup}>
                    <label htmlFor="name">Người nợ</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            value={debt.debtorUserName}
                            onChange={handleDescriptionChange}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Số tiền</label>
                    <div className={styles.inputWrapper}>
                        <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={(values) => {
                                setAmount(parseInt(values.value));
                            }}
                            decimalScale={0}
                            allowNegative={false}
                            isNumericString
                            format="#.###,##"
                            mask="_"
                            placeholder="Nhập số tiền"
                            value={amount}
                            disabled={isSendingRequest}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Ngày nợ</label>
                    <div className={styles.inputWrapper}>
                        <DatePicker
                            selected={owedDate}
                            startOpen={false}
                            onChange={date => {
                                setOwedDate(date)
                            }}
                            dateFormat="dd/MM/yyyy, HH:mm"
                            autoFocus={false}
                            timeIntervals={15}
                            timeFormat="HH:mm"
                            showTimeSelect
                            disabled={isSendingRequest}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Ghi chú</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Nhập ghi chú"
                            value={description}
                            onChange={handleDescriptionChange}
                            disabled={isSendingRequest}
                        />
                    </div>
                </div>
                <div className={styles.confirmButton} onClick={handleSubmit}>
                    {
                        isSendingRequest
                            ? <CircleLoader size="15px" strokeWidth="2px" color="transparent" />
                            : <label htmlFor="confirm">Hoàn tất</label>
                    }
                </div>
            </form>
            <div className={styles.closeButton} onClick={closeDialog}>
                <IoCloseOutline color="#000" size={30} />
            </div>
        </div>
    </Popup>
}

export default EditDebtDialog;