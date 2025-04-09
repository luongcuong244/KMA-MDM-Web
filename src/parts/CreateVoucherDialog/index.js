import React, { useState } from "react";
import styles from "./create_voucher_dialog.module.scss";
import Popup from "reactjs-popup";
import CircleLoader from "../../components/CircleLoader";
import AlertError from "../../components/AlertError";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";
import adminVoucherManagementService from "../../services/admin_voucher_management.service";
import { fetchVoucherTableData } from "../../slices/voucher_table_data.slice";

const CreateVoucherDialog = ({ setShowDialog }) => {

    const dispatch = useDispatch();

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [warning, setWarning] = useState("");
    const [voucherName, setVoucherName] = useState('Thẻ khuyến mại');
    const [description, setDescription] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [maxDiscount, setMaxDiscount] = useState(0);
    const [discountFactor, setDiscountFactor] = useState(1);
    const [minTopupAmount, setMinTopupAmount] = useState(0);
    const [expiredDate, setExpiredDate] = useState(new Date().getTime());

    const handleNameChange = (e) => {
        setVoucherName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleImageUrlChange = (e) => {
        setImageURL(e.target.value);
    }

    const handleMaxDiscountChange = (values) => {
        if (values.value === "") {
            setMaxDiscount(0);
            return;
        }
        setMaxDiscount(parseInt(values.value));
    }

    const handleDiscountFactorChange = (values) => {
        if (values.value === "") {
            setDiscountFactor(0);
            return;
        }
        setDiscountFactor(parseFloat(values.value));
    }

    const handleMinTopupAmountChange = (values) => {
        if (values.value === "") {
            setMinTopupAmount(0);
            return;
        }
        setMinTopupAmount(parseInt(values.value));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!voucherName) {
            return setWarning("Tên voucher không được để trống!");
        }

        if (!imageURL) {
            return setWarning("Đường dẫn ảnh không được để trống!");
        }

        if (maxDiscount < 0) {
            return setWarning("Giảm giá tối đa không được nhỏ hơn 0!");
        }

        if (discountFactor <= 1) {
            return setWarning("Hệ số khuyến mại không được nhỏ hơn hoặc bằng 1!");
        }

        if (minTopupAmount < 0) {
            return setWarning("Số tiền nạp tối thiểu không được nhỏ hơn 0!");
        }

        setWarning("");

        setIsSendingRequest(true);
        adminVoucherManagementService.createNewVoucher({ 
            voucherName,
            description,
            imageURL,
            maxDiscount,
            discountFactor,
            minTopupAmount,
            expiredDate,
        })
            .then(() => {
                setShowDialog(false);
                dispatch(fetchVoucherTableData({
                    pageNo: 1
                }));
            })
            .catch((err) => {
                const message = err?.response?.data?.message;
                if (message) {
                    setWarning(message);
                } else {
                    setWarning("Đã có lỗi xảy ra. Hãy thử lại sau ít phút!");
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
            <h2>Tạo voucher</h2>
            {
                warning && 
                <AlertError 
                    text={warning} 
                    style={{marginBottom: 10}} 
                    textSize="0.875rem"
                    showIcon={false}
                />
            }
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Tên</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            id="name"
                            placeholder="Nhập tên"
                            value={voucherName}
                            onChange={handleNameChange}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Mô tả</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            id="description"
                            placeholder="Nhập mô tả"
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Hình ảnh</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            id="imageURL"
                            placeholder="Nhập đường dẫn ảnh"
                            value={imageURL}
                            onChange={handleImageUrlChange}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Giảm giá tối đa</label>
                    <div className={styles.inputWrapper}>
                        <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={handleMaxDiscountChange}
                            decimalScale={0}
                            allowNegative={false}
                            isNumericString
                            format="#.###,##"
                            mask="_"
                            placeholder="Nhập số tiền giảm tối đa"
                            value={maxDiscount}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Hệ số khuyến mại</label>
                    <div className={styles.inputWrapper}>
                        <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={handleDiscountFactorChange}
                            decimalScale={2}
                            allowNegative={false}
                            isNumericString
                            format="#.###,##"
                            mask="_"
                            placeholder="Nhập hệ số khuyến mại"
                            value={discountFactor}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Số tiền nạp tối thiểu</label>
                    <div className={styles.inputWrapper}>
                        <NumericFormat
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={handleMinTopupAmountChange}
                            decimalScale={0}
                            allowNegative={false}
                            isNumericString
                            format="#.###,##"
                            mask="_"
                            placeholder="Nhập số tiền nạp tối thiểu"
                            value={minTopupAmount}
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>Ngày hết hạn</label>
                    <div className={styles.inputWrapper}>
                        <DatePicker
                            selected={expiredDate}
                            startOpen={false}
                            dateFormat="dd-MM-yyyy"
                            autoFocus={false}
                            onChange={(date) => {
                                if (date.getTime() < new Date().getTime()) return;
                                setExpiredDate(date.getTime());
                            }}
                        />
                    </div>
                </div>
            </form>
            <div className={styles.confirmButton} onClick={handleSubmit}>
                {
                    isSendingRequest
                        ? <CircleLoader size="15px" strokeWidth="2px" color="transparent" />
                        : <label htmlFor="confirm">Hoàn tất</label>
                }
            </div>
            <div className={styles.closeButton} onClick={closeDialog}>
                <IoCloseOutline color="#000" size={30} />
            </div>
        </div>
    </Popup>
}

export default CreateVoucherDialog;
