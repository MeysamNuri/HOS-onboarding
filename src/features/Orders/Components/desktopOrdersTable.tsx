import React from "react";
import {
    Table, Pagination, Select, Button,
    Empty,
    InputNumber,


} from "antd";
import {
    LeftOutlined,
    RightOutlined,

} from "@ant-design/icons";
import EmptyData from "@core/assets/images/empty-list.svg"

import DesktopFilters from "./desktopFilters";
import type { IOrersHstoryItems, IUserOrderHitoryRes } from "../types";
import OrderStatusTag from "./OrderStatusTag";
import { renderJalaliDate } from "@/core/helper/dateConverter";
import { NumberConverter } from "@/core/helper/numberConverter";


interface ITableProps {
    ordersHistoryData: IUserOrderHitoryRes | undefined,
    pageModel: {
        pageNumber: number,
        itemsPerPage: number
    },
    handlePageChange: (page: number, pageSize: number) => void;
    handlePageSizeChange: (pageSize: number) => void;
    goToPage: number | null,
    setGoToPage: React.Dispatch<React.SetStateAction<number | null>>,
    totalPages: number,
    isLoading: boolean,
    pageSize: number
}

const PackagesTable: React.FC<ITableProps> = ({ ordersHistoryData, pageSize, isLoading, pageModel, handlePageChange, handlePageSizeChange, goToPage, setGoToPage, totalPages }) => {


    const hanldePaymentLink = (link: string) => {
        if (link)
            window.location.href = link
    }
    const customLocale = {
        emptyText: (
            <Empty
                image={EmptyData}
                description="اطلاعاتی برای نمایش وجود ندارد"
            />
        ),
    };
    const columns = [
        {
            title: "نوع بسته",
            dataIndex: "name",
            key: "name",
            width: 1000,
            align: "center" as const,
        },
        {
            title: "باقی مانده بسته",
            dataIndex: "remain",
            key: "remainedQuantity",
            align: "center" as const,
            render: (_: any, record: IOrersHstoryItems) => (
                <div className="remaining-cell">
                    {
                        <div >
                            <div>
                                <span key={record?.orderId}>{NumberConverter.latinToArabic(record?.totalCount)}</span>
                                <small style={{ marginRight: "5px" }}>کل</small>
                            </div>
                            <div>
                                <span key={record?.orderId}>{NumberConverter.latinToArabic(record?.remainedQuantity)}</span>
                                <small style={{ marginRight: "5px" }}>مانده</small>
                            </div>
                        </div>
                    }
                </div>
            ),
        },
        {
            title: "سریال",
            dataIndex: "serial",
            key: "serial",
            align: "center" as const,
            render: (value: string) => (
                <div className="price-cell">
                    <span>{NumberConverter.latinToArabic(value)}</span>

                </div>
            ),
        },
        {
            title: "تاریخ خرید",
            dataIndex: "buyDate",
            key: "buyDate",
            width: 150,
            align: "center" as const,
            render: (value: string) => NumberConverter.latinToArabic(renderJalaliDate(value)) 
        },
        {
            title: "مبلغ",
            dataIndex: "payment",
            key: "payment",
            align: "center" as const,
            render: (value: string) => (
                <div className="price-cell">
                    <span>{NumberConverter.latinToArabic(NumberConverter.formatNumberWithCommas((Number(value) / 10)))}</span>

                    <small>تومان</small>
                </div>
            ),
        },
        {
            title: "تاریخ شروع/پایان",
            key: "dateRange",           // unique key
            align: "center" as const,
            width: 180,

            render: (_: any, record: IOrersHstoryItems) => (
                <div className="date-cell">
                    <div>پایان: {NumberConverter.latinToArabic(renderJalaliDate(record.endDate)) }</div>
                    <div>شروع: {NumberConverter.latinToArabic( renderJalaliDate(record.startDate))}</div>


                </div>
            ),
        },
        {
            title: "وضعیت بسته",
            dataIndex: "status", 
            key: "status",
            align: "center" as const,
            render: (status: string, record: IOrersHstoryItems) => (
                <OrderStatusTag status={status} isSuccessPayment={record.isSuccessPayment} />
            ),
        },
        {
            title: "پرداخت",
            dataIndex: "payment",
            key: "payment",
            width: 180,
            align: "center" as const,
            render: (_: string, record: IOrersHstoryItems) => {
                return record.status === "PaymentFailed" || !record.isSuccessPayment ?

                    <div className="payment-failed" onClick={() => hanldePaymentLink(record?.link)}>
                        <span>پرداخت</span>
                        <LeftOutlined />
                    </div>


                    :
                    <div className="payment-cell">
                        <span>ش مرجع {record?.referenceNumber == "" ? "-" : record?.referenceNumber}</span>
                        <span>ش پیگیری {record?.trackingNumber == "" ? "-" : record?.trackingNumber}</span>
                    </div>
            },
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
                className="packages-table"
                locale={customLocale}
                scroll={{ x: 1080 }}
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
        </div>


    );
};

export default PackagesTable;

