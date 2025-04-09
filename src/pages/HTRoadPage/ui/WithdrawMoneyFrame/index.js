import React, { useState } from "react";
import styles from "./withdraw_money_frame.module.scss";
import QuestionMark from "../../../../assets/imgs/question_mark.png";
import { NumericFormat } from 'react-number-format';
import Keyboard from "./Keyboard";
import SendRequestButton from "./SendRequestButton";
import userService from "../../../../services/user.service";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setMoney } from "../../../../slices/user.slice";
import { fetchTopupRequestDataForUser } from "../../../../slices/topup_request_data_for_user.slide";

const WithdrawMoneyFrame = () => {

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [amountInput, setAmountInput] = useState("");

    const handleSubmit = () => {

        const amountToWithdraw = amountInput;

        if (!Number.isInteger(amountToWithdraw)) {
            alert("Số tiền không hợp lệ!");
            return;
        }

        // check if user has enough money
        if (amountToWithdraw > user.amount) {
            alert("Số dư không đủ!");
            return;
        }

        if (amountToWithdraw < 10000) {
            alert("Số tiền phải lớn hơn 10.000đ!");
            return;
        }

        if (amountToWithdraw > 10000000) {
            alert("Số tiền phải nhỏ hơn 10.000.000đ!");
            return;
        }

        setIsSendingRequest(true);
        userService.createTopupRequest(amountToWithdraw)
            .then((res) => {
                alert("Yêu cầu rút tiền thành công!");

                // update user info
                dispatch(setMoney(user.amount - amountToWithdraw));
                // update topup request data
                dispatch(fetchTopupRequestDataForUser());
            }).catch((err) => {
                const message = err?.response?.data?.message;
                console.log(err);
                if (message) {
                    alert(message);
                } else {
                    alert("Lỗi không xác định!");
                }
            }).finally(() => {
                setIsSendingRequest(false);
                // clear input
                setAmountInput("");
            });
    };

    const handleKeyboardClick = (value) => {

        if (isSendingRequest) {
            return;
        }

        if (value === "C") {
            if (!amountInput) {
                return;
            }
            let newAmount = amountInput.toString().slice(0, -1);
            if (newAmount === "") {
                setAmountInput("");
                return;
            }
            setAmountInput(parseInt(newAmount));
            return;
        }

        if (amountInput.toString().length >= 7) {
            return;
        }

        let newAmount = amountInput.toString() + value;
        setAmountInput(parseInt(newAmount));
    }

    return (
        <div id={styles.root}>
            <div className={styles.header}>
                <span className={styles.title}>
                    Rút tiền
                </span>
                <img
                    className={styles.question_mark}
                    src={QuestionMark}
                    alt="Question Mark"
                />
            </div>

            <div className={styles.inputWrapper}>
                <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    onValueChange={(values) => {
                        if (values.value === "") {
                            setAmountInput("");
                            return;
                        }
                        setAmountInput(parseInt(values.value));
                    }}
                    decimalScale={0}
                    allowNegative={true}
                    isNumericString
                    format="#.###,##"
                    mask="_"
                    placeholder="Nhập số tiền cần rút"
                    value={amountInput}
                    disabled={true}
                />
            </div>

            <Keyboard onClick={handleKeyboardClick} disable={isSendingRequest} />

            <SendRequestButton onClick={handleSubmit} isSendingRequest={isSendingRequest} />
        </div>
    );
}

export default WithdrawMoneyFrame;