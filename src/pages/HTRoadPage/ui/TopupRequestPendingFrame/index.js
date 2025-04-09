import React from "react";
import styles from "./topup_request_pending.module.scss";
import QuestionMark from "../../../../assets/imgs/question_mark.png";
import ItemRow from "./ItemRow";
import Scrollable from "../../../../components/Scrollable";
import { selectScrollableManagement } from "../../../../slices/scrollable_management.slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTopupRequestDataForUser, selectTopupRequestDataForUser } from "../../../../slices/topup_request_data_for_user.slide";
import Loader from "../../../../components/Loader";

const TopupRequestPendingFrame = () => {

    const dispatch = useDispatch();

    const topupRequestData = useSelector(selectTopupRequestDataForUser);

    useEffect(() => {
        dispatch(fetchTopupRequestDataForUser());
    }, []);

    const items = [
        {
            id: 1,
            iconUrl: "https://i.imgur.com/63ci3X9.png",
            amount: 50000,
            timestamp: new Date().getTime(),
        },
        {
            id: 1,
            iconUrl: "https://i.imgur.com/63ci3X9.png",
            amount: 100000,
            timestamp: new Date().getTime(),
        },
        {
            id: 1,
            iconUrl: "https://i.imgur.com/63ci3X9.png",
            amount: 10000,
            timestamp: new Date().getTime(),
        },
        {
            id: 1,
            iconUrl: "https://i.imgur.com/63ci3X9.png",
            amount: 100000,
            timestamp: new Date().getTime(),
        }
    ]

    const scrollableManagement = useSelector(selectScrollableManagement);

    return (
        <div id={styles.root}>
            <div className={styles.header}>
                <span className={styles.title}>
                    Chờ duyệt
                </span>
                <img
                    className={styles.question_mark}
                    src={QuestionMark}
                    alt="Question Mark"
                />
            </div>

            {
                topupRequestData.data && topupRequestData.data.length > 0 &&
                    <Scrollable
                        allowScroll={scrollableManagement.allowScrollOnTopupRequestPendingFrame}
                    >
                        <ul className={styles.item_list}>
                            {topupRequestData.data.map((item, index) => {
                                console.log(item);
                                return (
                                    <li key={index}>
                                        <ItemRow item={item} />
                                    </li>
                                );
                            })}
                        </ul>
                    </Scrollable>
            }

            {
                (topupRequestData.data && topupRequestData.data.length === 0) &&
                    <div className={styles.no_item}>
                        Bạn không có yêu cầu nạp tiền nào đang chờ được duyệt !
                    </div>
            }

            {
                topupRequestData.isLoading &&
                    <div className={styles.loading}>
                        <Loader color="white" width="40px" />
                    </div>
            }

            {
                topupRequestData.errorMessage &&
                    <div className={styles.error}>
                        {topupRequestData.errorMessage}
                    </div>
            }
        </div>
    );
}

export default TopupRequestPendingFrame;