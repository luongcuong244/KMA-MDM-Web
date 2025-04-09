import React, { useState } from "react";
import styles from "./topup_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import { NumericFormat } from 'react-number-format';

const TopupDialog = ({ setShowDialog, user }) => {
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!Number.isInteger(amount)) {
            return setWarning("Số tiền không hợp lệ!");
        }
        setWarning("");

        setIsSendingRequest(true);
        setTimeout(() => {
            setIsSendingRequest(false);
        }, 1000)
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
            <h2>{`Nạp tiền ( ${user.userName} )`}</h2>
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
                    <label htmlFor="name">Số tiền</label>
                    <div className={styles.inputWrapper}>
                        <NumericFormat 
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={(values) => {
                                setAmount(parseInt(values.value));
                            }}
                            decimalScale={0}
                            allowNegative={true}
                            isNumericString
                            format="#.###,##"
                            mask="_"
                            placeholder="Nhập số tiền"
                            onSubmit={handleSubmit}
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

export default TopupDialog;