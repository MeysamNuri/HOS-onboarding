import React from "react";
import {
    Table, Tag, Pagination, Select, Button,
    Empty,
    Tooltip,
    InputNumber

} from "antd";
import {
    LeftOutlined,
    RightOutlined,
    CopyOutlined

} from "@ant-design/icons";

import EmptyData from "@core/assets/images/empty-list.svg"
import Visibility from "@core/assets/icons/more_vert.svg"
import DesktopFilters from "./desktopFilters";
import type { ISendLinksItems, ISendLinksRes } from "../types";
import { statusMap } from "../types";
import { renderJalaliDate2 } from "@/core/helper/dateConverter";
import { truncateString } from "@/core/helper/limitText";
import { NumberConverter } from "@/core/helper/numberConverter";
import BottomModal from "@/core/components/customModal";
import SentLinkDetails from "./SentLinkDetails";



interface ITableProps {
    ordersHistoryData: ISendLinksRes | undefined,
    pageModel: {
        pageNumber: number,
        itemsPerPage: number
    },
    handlePageChange: (page: number, pageSize: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
    handeleRecordDetails: (record: ISendLinksItems) => void
    handleCopy: (link: string) => Promise<void>
    goToPage: number | null,
    setGoToPage: React.Dispatch<React.SetStateAction<number | null>>,
    totalPages: number,
    isLoading: boolean,
    pageSize: number,
    selectedRecordDetails: ISendLinksItems | undefined,
    hadleCloseDetailsModal: () => void,
    showDetailssModal: boolean
}

const PackagesTable: React.FC<ITableProps> = ({ selectedRecordDetails, hadleCloseDetailsModal, showDetailssModal, ordersHistoryData, pageSize, isLoading, pageModel, handeleRecordDetails, handlePageChange, handlePageSizeChange, handleCopy, totalPages, setGoToPage, goToPage }) => {

    const customLocale = {
        emptyText: (
            <Empty
                image={EmptyData}
                description="اطلاعاتی برای نمایش وجود ندارد"
            />
        ),
    };

    const hanldePaymentLink = (link: string) => {
        if (link)
            window.location.href = link
    }


    const columns = [
        {
            title: "تاریخ  ارسال",
            key: "sendDate",
            width: 140,
            render: (record: ISendLinksItems) => (
                <div className="date-cell">
                    <div>{NumberConverter.latinToArabic(renderJalaliDate2(record?.sendDate))}</div>

                </div>
            ),
        },
        {
            title: "نوع سند",
            dataIndex: "reportType",
            key: "reportType",
            align: "center" as const,
            width: 115,
            ellipsis: true,
        },
        {
            title: "وضعیت پیام",
            dataIndex: "status",
            key: "status",
            align: "center" as const,
            width: 120,

            render: (status: keyof typeof statusMap) => (
                <Tag className={`status-tag-links ${statusMap[status]?.className}`}>
                    {statusMap[status]?.text}
                </Tag>
            ),
        },
        {
            title: "دریافت کننده",
            dataIndex: "fullName",
            key: "fullName",
            width: 140,
            align: "center" as const,
            ellipsis: true,
            render: (_: string, record: ISendLinksItems) => (
                <div >
                    <span>{record?.fullName == "" || record?.fullName == null ? "-" : record?.fullName}</span>
                </div>
            )
        },
        {
            title: "موبایل",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            align: "center" as const,
            width: 130,
            render: (value: string) => (
                <div className="price-cell">
                    <span>{NumberConverter.latinToArabic(value)}</span>

                </div>
            ),
        },

        {
            title: "متن پیام",
            dataIndex: "messageText",
            key: "messageText",
            width: 180,
            ellipsis: true,

            render: (_: string, record: ISendLinksItems) => (
                <div >
                    <Tooltip title={record?.messageText} style={{ backgroundColor: "red" }} >
                        <span>{truncateString(record?.messageText ?? "")}</span>
                    </Tooltip>
                </div>
            )
        },


        {
            title: "لینک",
            dataIndex: "payment",
            key: "payment",
            width: 205,
            render: (_: string, record: ISendLinksItems) => (
                <div style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 8 }}>
                    <Tooltip title={record?.messageLink}>
                        <span
                            style={{
                                minWidth: 0,
                                overflow: "hidden",
                                flex: 1,
                                color: "red",
                                cursor: "pointer",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            onClick={() => hanldePaymentLink(record?.messageLink)}
                        >
                            {record?.messageLink}
                        </span>
                    </Tooltip>

                    {
                        record?.messageLink &&
                        <CopyOutlined style={{ flex: "0 0 auto", color: "red" }} onClick={() => handleCopy(record?.messageLink)} />

                    }
                </div>

            )
        },


        {
            title: "عملیات",
            dataIndex: "operation",
            key: "operation",
            width: 70,
            align: "center" as const,
            render: (_: string, record: ISendLinksItems) => (
                <button
                    type="button"
                    aria-label="مشاهده جزئیات"
                    onClick={() => handeleRecordDetails(record)}
                    style={{
                        display: "inline-flex",
                        width: 32,
                        height: 32,
                        padding: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                    }}
                >
                    <img src={Visibility} width={24} height={24} alt="" />
                </button>
            )
        },
    ];

    return (


        <div className="packages-table-wrapper">
            <DesktopFilters handlePageChange={handlePageChange} pageSize={pageSize} />

            <Table
                loading={isLoading}
                columns={columns}
                dataSource={ordersHistoryData?.items}
                pagination={false}
                bordered={false}
                rowClassName={() => "custom-row"}
                className="packages-table sent-links-desktop-table"
                locale={customLocale}
                tableLayout="fixed"
                style={{ minHeight: "20rem" }}

            />

            <div className="table-footer">
                <div className="pagination-right">
                    <span className="total">
                        تعداد کل : {ordersHistoryData?.totalCount}
                    </span>

                    <Pagination
                        current={pageModel?.pageNumber}
                        total={ordersHistoryData?.totalCount}
                        pageSize={pageModel?.itemsPerPage}
                        showSizeChanger={false}
                        onChange={handlePageChange}
                        itemRender={(_, type, originalElement) => {
                            if (type === "prev") {
                                return (
                                    <Button className="pagination-btn">
                                        <RightOutlined />
                                    </Button>
                                );
                            }

                            if (type === "next") {
                                return (
                                    <Button className="pagination-btn">
                                        <LeftOutlined />
                                    </Button>
                                );
                            }

                            return originalElement;
                        }}
                    />


                </div>

                <div className="page-size">
                    <Select
                        defaultValue={pageModel?.itemsPerPage}
                        onChange={(value: number) => handlePageSizeChange(value)}
                    >
                        <Select.Option value={10}>10 / صفحه</Select.Option>
                        <Select.Option value={20}>20 / صفحه</Select.Option>
                        <Select.Option value={30}>30 / صفحه</Select.Option>
                    </Select>
                </div>

                <div className="goto-page">
                    <span>برو به صفحه</span>

                    <InputNumber
                        min={1}
                        max={totalPages}
                        value={goToPage ?? undefined}
                        onChange={(value) => setGoToPage(value)}
                    />

                </div>
            </div>
            <BottomModal open={showDetailssModal} onClose={hadleCloseDetailsModal} showHandler={true} modalTitle="جزئیات لینک ارسال شده">
                <SentLinkDetails onClose={hadleCloseDetailsModal} selectedRecord={selectedRecordDetails} />
            </BottomModal>
        </div>

    );
};

export default PackagesTable;

