import React from "react";
import { Button, Card, Col, Empty, Row, Space, Spin, Tag } from "antd";
import { CopyOutlined, CloseOutlined, MoreOutlined } from "@ant-design/icons";

import Filter from "@core/assets/icons/filter_list.svg"
import BottomModal from "@/core/components/customModal";
import useSendLinksDetailsHooks from "../Hooks/sentLinksDetailsHooks";
import FilterPanel from "./mobileFilter";
import { statusMap, type ISendLinksItems } from "../types";
import EmptyData from "@core/assets/images/empty-list.svg"

import { renderJalaliDate2 } from "@/core/helper/dateConverter";
import { SearchInput } from "@/core/components/searchInput";
import { clearFilter } from "@/features/SendLink/reducers/filterSlice";
import { useSelector } from "react-redux";
import { getFilterValue } from "@/core/helper/filterstranslate";
import { NumberConverter } from "@/core/helper/numberConverter";
import useSentLinksHooks from "../Hooks/sentLinksHook";
import SentLinkDetails from "./SentLinkDetails";

interface MobileOrdersCardProps {
    data: ISendLinksItems[] | undefined,
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
        usersSerialsList,
        userListLoading,
        dispatch,

        handleCopy,
        setSearchValue, searchValue } = useSendLinksDetailsHooks({ handlePageChange, pageNumber, totalPages, pageSize })

    const {
        handeleRecordDetails,
        selectedRecordDetails,
        hadleCloseDetailsModal,
        showDetailssModal,
    } = useSentLinksHooks()

    const sentLinksItems: ISendLinksItems[] | undefined = data
    const filters = useSelector((state: any) => state?.sendLinksfilters);


    return (

        <Row style={{ width: "100%" }}>
            <Col xs={6} md={4} >
                <Button
                    type="text"
                    className="send-links-mobile-filter"
                    onClick={() => setShowMobileFlters(true)}
                >
                    <img src={Filter} alt="Filter" width={20} height={20} />
                    فیلتر
                </Button>
            </Col>
            <Col xs={18} md={20}>
                <SearchInput value={searchValue} onChange={setSearchValue} placeholder="جستجو نام، متن و موبایل" />

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
            {sentLinksItems && sentLinksItems.length > 0 ? (
                sentLinksItems.map((i, index) => {

                    return (
                        <Card
                            key={index}
                            className="sent-link-card"
                            bordered={false}
                            loading={isLoading}
                        >
                            {/* Header */}
                            <div className="sent-link-card__header">

                                {/* Right side */}
                                <div className="sent-link-card__header-right">
                                    <h3 className="sent-link-card__title">
                                        {i?.reportType == "" ? "-" : i?.reportType}
                                    </h3>


                                </div>

                                {/* Status */}
                                <Tag
                                    className={`status-tag-links ${statusMap[
                                        i?.status as keyof typeof statusMap
                                    ]?.className
                                        }`}
                                >
                                    {
                                        statusMap[
                                            i?.status as keyof typeof statusMap
                                        ]?.text
                                    }
                                </Tag>
                            </div>
                            <div className="sent-link-card__person-row">
                                <span className="sent-link-card__name">
                                    {i?.fullName === " " || !i?.fullName
                                        ? "-"
                                        : i?.fullName}
                                </span>

                                <span className="sent-link-card__phone">
                                    {i?.phoneNumber === " " || !i?.phoneNumber
                                        ? "-"
                                        : NumberConverter.latinToArabic(
                                            i?.phoneNumber
                                        )}
                                </span>
                            </div>
                            {/* Send date */}
                            <div className="sent-link-card__date">
                                <span>تاریخ ارسال:</span>

                                <span>
                                    {i?.sendDate
                                        ? NumberConverter.latinToArabic(renderJalaliDate2(i?.sendDate))
                                        : "-"}
                                </span>
                            </div>

                            {/* Link */}
                            <div className="sent-link-card__link-section">
                                <span className="sent-link-card__section-title">
                                    لینک ارسال‌شده
                                </span>

                                <div className="sent-link-card__link-box">
                                    <CopyOutlined
                                        className="sent-link-card__copy"
                                        onClick={() =>
                                            handleCopy(i?.messageLink)
                                        }
                                    />

                                    <span
                                        className="sent-link-card__link"
                                        title={i?.messageLink}
                                    >
                                        {i?.messageLink || "-"}
                                    </span>
                                </div>
                            </div>

                            {/* Statistics */}
                            {/* <div className="sent-link-card__stats">

                    <div className="sent-link-card__stat">
                        <span className="sent-link-card__stat-value">
                            {i.viewCount ?? 13}
                        </span>

                        <span className="sent-link-card__stat-label">
                            رویت
                        </span>
                    </div>

                    <div className="sent-link-card__stat">
                        <span className="sent-link-card__stat-value">
                            {i.downloadCount ?? 21}
                        </span>

                        <span className="sent-link-card__stat-label">
                            دانلود
                        </span>
                    </div>

                    <div className="sent-link-card__stat">
                        <span className="sent-link-card__stat-value">
                            {i.shareCount ?? 21}
                        </span>

                        <span className="sent-link-card__stat-label">
                            اشتراک‌گذاری
                        </span>
                    </div>

                </div> */}

                            {/* Divider */}
                            <div className="sent-link-card__divider" />

                            {/* Details */}
                            <button
                                type="button"
                                className="sent-link-card__details"
                                onClick={() => handeleRecordDetails(i)}
                            >
                                <span className="sent-link-card__details-title">
                                    جزئیات ارسال
                                </span>

                                <MoreOutlined
                                    className="sent-link-card__details-icon"
                                />
                            </button>


                        </Card>
                    );
                })
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

                <FilterPanel handlePageChange={handlePageChange} pageSize={pageSize} usersList={usersSerialsList?.Data} onClose={handleCloseMobileFilter} userLitLoading={userListLoading} />
            </BottomModal>
            <BottomModal open={showDetailssModal} onClose={hadleCloseDetailsModal} showHandler={true} modalTitle="جزئیات لینک ارسال شده">
                <SentLinkDetails handleCopy={handleCopy} isMobile={true} onClose={hadleCloseDetailsModal} selectedRecord={selectedRecordDetails} />
            </BottomModal>
        </Row>
    );
};

export default MobileOrdersCard;
