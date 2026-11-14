import React from "react";
import { Button, Card, Col, Empty, Row, Tag, Typography, Space, Spin } from "antd";
import {
    LeftOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { NumberConverter } from "@/core/helper/numberConverter";
import Filter from "@core/assets/icons/filter_list.svg"
import BottomModal from "@/core/components/customModal";
import useOrderDetailsHooks from "../Hooks/ordersDetailsHooks";
import FilterPanel from "./mobileFilter";
import {type IOrersHstoryItems } from "../types";
import EmptyData from "@core/assets/images/empty-list.svg"
import { useSelector } from "react-redux";
import MobileViewDetails from "./mobileDetailsView";
import { renderJalaliDate } from "@/core/helper/dateConverter";
import { clearFilter } from "../reducers/filterSlice";
import { getFilterValue } from "@/core/helper/filterstranslate";
import "@core/assets/styles/mobileFilters.scss"
import OrderStatusTag from "./OrderStatusTag";

interface MobileOrdersCardProps {
    data: IOrersHstoryItems[] | undefined,
    isLoading: boolean,
    handlePageChange: (page: number, pageSize: number) => void
    pageNumber: number
    pageSize: number
    totalPages: number
}

const MobileOrdersCard: React.FC<MobileOrdersCardProps> = ({
    data,
    isLoading,
    handlePageChange,
    pageNumber,
    pageSize,
    totalPages
}) => {
    const { showMobileFilter,
        handleCloseMobileFilter,
        setShowMobileFlters,
        usersSerialsList, userListLoading, handleCloseMobileDetailsModal,
        showMobileDetails, handleSelectedIHistoryItem, selectedItemDetails,
        dispatch,
        serial
    } = useOrderDetailsHooks({ handlePageChange, pageNumber, totalPages, pageSize })
    const ordersItems: IOrersHstoryItems[] | undefined = data
    const filters = useSelector((state: any) => state?.filters);



    return (

        <Row style={{ width: "100%" }}>
            <Col span={24} className="filter-container">
                <Button onClick={() => setShowMobileFlters(true)}>
                    <img src={Filter} />
                    فیلتر
                </Button>


                <div className="serial-details">
                    <Typography style={{ marginLeft: "30px" }}>سریال</Typography>
                    <Typography >{NumberConverter.latinToArabic(filters?.serial === "" ? serial: filters?.serial)}</Typography>

                </div>
            </Col>

            <Space size={[8, 8]} style={{ display: "flex", flexDirection: "row", overflow: "scroll", marginBottom: "10px", width: "100%" }}>
                {Object.entries(filters)
                    .filter(([, value]) => Boolean(value))
                    .map(([key, value]) => (
                        <Tag
                            key={key}
                            closable
                            closeIcon={<CloseOutlined />}
                            onClose={() => dispatch(clearFilter(key))}
                            className="filter-badge"
                            style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                fontSize: 14,
                            }}
                        >

                            {getFilterValue(key, String(value))}
                        </Tag>
                    ))}
            </Space>
            {

                ordersItems && ordersItems.length > 0 ? (
                    ordersItems.map((i, index) => (
                        <Card key={index} className="package-card" bordered={false} loading={isLoading}>
                            <div className="package-card__header">
                                <h3>{i.name}</h3>
                                <button className={`${i.status == "PaymentFailed" ? "payment-btn" : "details-btn"}`} onClick={(e) => handleSelectedIHistoryItem(e, i)}>
                                    <span> {i.status === "PaymentFailed" ? ("پرداخت") : ("جزئیات")}</span>
                                    <LeftOutlined />
                                </button>
                            </div>

                            <div className="package-card__content">
                                <div className="package-card__row">
                                    <span className="label">وضعیت بسته</span>
                                    <OrderStatusTag status={i.status} isSuccessPayment={i.isSuccessPayment} />
                                </div>

                                <div className="package-card__row">
                                    <span className="label"> تاریخ خرید</span>
                                    <span className="value">
                                        {
                                            i.buyDate ?
                                                renderJalaliDate(i.buyDate) : "-"}
                                    </span>

                                </div>

                                <div className="package-card__row">
                                    <span className="label">مبلغ</span>
                                    <span className="price">
                                        {

                                            NumberConverter.formatNumberWithCommas(
                                                Number(i.payment) / 10
                                            )} تومان
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))
                ) :
                    isLoading ? <Spin size="large" className="custom-spin" style={{ margin: "30px auto" }} /> :
                        (
                            <div style={{ margin: "auto" }}>
                                <Empty
                                    image={EmptyData}
                                    description="اطلاعاتی برای نمایش وجود ندارد"
                                />
                            </div>
                        )}


            <BottomModal open={showMobileFilter} onClose={handleCloseMobileFilter} showHandler={true} fitContent >

                <FilterPanel
                    handlePageChange={handlePageChange}
                    pageSize={pageSize}
                    usersList={usersSerialsList?.Data} onClose={handleCloseMobileFilter} userLitLoading={userListLoading} />
            </BottomModal>
            <BottomModal open={showMobileDetails} onClose={handleCloseMobileDetailsModal} showHandler={false} height='100vh'>
                <MobileViewDetails data={selectedItemDetails} userSerial={filters?.serial} onClose={handleCloseMobileDetailsModal} />
            </BottomModal>
        </Row>
    );
};

export default MobileOrdersCard;
