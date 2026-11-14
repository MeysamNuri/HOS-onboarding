import React from "react";
import { Empty, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    CopyOutlined,
    MessageFilled,
    WhatsAppOutlined,
} from "@ant-design/icons";
// import dayjs from "dayjs";
import { renderJalaliDate2 } from "@/core/helper/dateConverter";
import "./SentLinkDetails.scss";
import { statusMap, type IDetails, type ISendLinksItems } from "../types";
import EmptyData from "@core/assets/images/empty-list.svg"
import { NumberConverter } from "@/core/helper/numberConverter";
import Bale from "@core/assets/icons/bale.svg"


interface ISentLinkDetailsProps {
    isMobile?: boolean;
    handleCopy?: (link: string) => Promise<void>;
    onClose: () => void;
    selectedRecord: ISendLinksItems | undefined;

}

const SentLinkDetails: React.FC<ISentLinkDetailsProps> = ({
    isMobile,
    handleCopy,
    onClose,
    selectedRecord,

}) => {
    const getChannelIcon = (channel: string) => {
        const value = channel?.toLowerCase();

        if (
            value?.includes("sms") ||
            value?.includes("پیامک")
        ) {
            return (
                <div style={{ display: "flex" }}>
                    <span className="channel-icon sms-icon">
                        <MessageFilled />
                    </span>
                    <span>پیامک</span>
                </div>
            );
        }

        if (
            value?.includes("whatsapp") ||
            value?.includes("واتساپ")
        ) {
            return (
                // <span className="channel-icon whatsapp-icon">
                //     <WhatsAppOutlined />
                // </span>
                <div style={{ display: "flex" }}>
                    <span className="channel-icon whatsapp-icon">
                        <WhatsAppOutlined />
                    </span>
                    <span>واتساپ</span>
                </div>
            );
        } 

        if (
            value?.includes("bale") ||
            value?.includes("بله")
        ) {
            return (
                <div style={{ display: "flex" }}>
                    <span className="channel-icon bale-icon">
                        <img src={Bale} width={25} />
                    </span>
                    <span>بله</span>
                </div>

            );
        }

        return null;
    };



    const columns: ColumnsType<IDetails> = [
        {
            title: "نام کانال",
            dataIndex: "channel",
            key: "channel",
            align: "center",

            render: (channel: string) => (
                <div className="channel-cell">
                    {getChannelIcon(channel)}
                </div>
            ),
        },
        {
            title: "زمان ارسال",
            dataIndex: "createDate",
            key: "createDate",
            width: "37%",
            render: (createDate: string) => {
                // const { date, time } = formatDate(createDate);

                return (
                    <div className="date-cell">
                        <span>{NumberConverter.latinToArabic(renderJalaliDate2(createDate))}</span>

                    </div>
                );
            },
        },
        {
            title: "وضعیت",
            dataIndex: "status",
            key: "status",
            width: "32%",
            render: (status: keyof typeof statusMap) => (
                <Tag
                    className={`status-tag-links ${statusMap[status]?.className}`}
                >
                    {statusMap[status]?.text}
                </Tag>
            ),
        },
    ];
    const customLocale = {
        emptyText: (
            <Empty
                style={{ margin: "16px" }}
                image={EmptyData}
                description="اطلاعاتی برای نمایش وجود ندارد"
            />
        ),
    };
    return (

        <div className="sent-link-container">

            {/* Link information */}
            {
                isMobile ? (
                    <div className="sent-link-card" style={{ padding: "12px 16px",width:"100%" }}>
                        <div className="sent-link-card__person-row">
                            <span className="sent-link-card__name">
                                {selectedRecord?.fullName === " " ||
                                    !selectedRecord?.fullName
                                    ? "-"
                                    : selectedRecord?.fullName}
                            </span>

                            <span className="sent-link-card__phone">
                                {selectedRecord?.phoneNumber === " " ||
                                    !selectedRecord?.phoneNumber
                                    ? "-"
                                    : NumberConverter.latinToArabic(
                                        selectedRecord?.phoneNumber
                                    )}
                            </span>
                        </div>

                        {/* Send date */}
                        <div className="sent-link-card__date">
                            <span>تاریخ ارسال:</span>

                            <span>
                                {selectedRecord?.sendDate
                                    ? NumberConverter.latinToArabic(
                                        renderJalaliDate2(selectedRecord?.sendDate)
                                    )
                                    : "-"}
                            </span>
                        </div>

                        {/* Link */}
                        <div className="sent-link-card__link-section">
                            <span className="sent-link-card__section-title">
                                لینک و متن ارسال‌شده
                            </span>

                            <div className="sent-link-card__link-box" style={{
                                height:"auto",
                                padding:"12px",display:"flex",maxWidth:"unset",
                                flexDirection:"row-reverse"}}>
                                <span style={{wordBreak:"break-word",width:"85%"}}>{selectedRecord?.messageText}</span>

                                <CopyOutlined
                                    className="sent-link-card__copy"
                                    onClick={() =>
                                        handleCopy?.(
                                            selectedRecord?.messageText ?? ""
                                        )
                                    }
                                />
                            </div>
                            
                        </div>
                    </div>
                ) : (
                    <div className="link-info">
                        <span className="link-title">
                            {selectedRecord?.fullName || "-"}
                        </span>

                        <span className="phone-number">
                            {selectedRecord?.phoneNumber
                                ? NumberConverter.latinToArabic(
                                    selectedRecord?.phoneNumber
                                )
                                : "-"}
                        </span>
                    </div>
                )
            }

            {/* Details table */}
            <div className="sent-table-wrapper">
                <Table<IDetails>
                    columns={columns}
                    dataSource={selectedRecord?.details}
                    rowKey={(record) =>
                        record?.messageId
                    }
                    locale={customLocale}

                    pagination={false}
                    bordered
                    className="sent-table"
                />
            </div>

            {/* Footer */}
            <div className="modal-footer">
                <button
                    type="button"
                    className="cancel-button"
                    onClick={onClose}
                >
                    انصراف
                </button>
            </div>
        </div>

    );
};

export default SentLinkDetails;
