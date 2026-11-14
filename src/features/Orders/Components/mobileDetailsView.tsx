import { useCallback, useState } from "react";
import {
    Card,
    Button,

    Typography,
    message,
    Row,
    Col,
} from "antd";
import {
    CloseOutlined,
    CopyOutlined,
    UpOutlined,
    DownOutlined

} from "@ant-design/icons";
import award from "@core/assets/images/award_star.svg";
import "@core/assets/styles/detailsForMobileView.scss";
import type { IOrersHstoryItems } from "../types";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import { NumberConverter } from "@/core/helper/numberConverter";
import { renderJalaliDate } from "@/core/helper/dateConverter";
import { useSelector } from "react-redux";
import type { RootState } from "@/core/constants/store";

const MobileViewDetails = ({ data, userSerial,onClose }: { data: IOrersHstoryItems, userSerial: string,  onClose: () => void}) => {
    const userInfo = useSelector((state: RootState) => state.userInfo?.value);

    const [open, setOpen] = useState(true);
    const { Text } = Typography;
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard?.writeText(userSerial ?? "");
            message.success("کپی شد!");
        } catch (err) {
            console.error("Copy failed", err);
            message.error("خطا در کپی");
        }
    }, []);

    const renderRow = (
        label: string,
        value: React.ReactNode,
        extraClass?: string
    ) => (
        <Row className={extraClass ?? "order-rows"}>
            <Col span={12} className="right-item">
                <Text>{label}</Text>
            </Col>
            <Col span={12} className="left-item">
                {value}
            </Col>
        </Row>
    );


    const domestic = convertToDomesticFormat(userInfo?.phoneNumber ?? "");

    const handleGuideLink = () => {
        if (data?.serviceName === "ارسال لینک") {
            window.location.href = "/plans/SendInvoice/sendInvoice-guide"
        }
    }
    return (
        <div className="package-page">
            {/* HEADER */}
            <div className="top-bar">
                <button className="close-btn">
                    <CloseOutlined />
                </button>
            </div>

            <div
                className="gray-box"
                style={{
                    borderBottom: "2px solid #fff",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                }}
            >
                {renderRow("شماره موبایل", <Text>{NumberConverter.latinToArabic(domestic)}</Text>, "")}


            </div>

            <div
                className="gray-box"
                style={{
                    borderBottomRightRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    marginBottom: "16px"

                }}
            >
                <Row >
                    <Col span={14} className="right-item">
                        <Row style={{ alignItems: "flex-start" }}>
                            <img
                                src={award}
                                width={25}
                                style={{ marginLeft: "10px" }}
                                alt="award"
                            />
                            <Row style={{ flexDirection: "column" }}>
                                <Text style={{ fontWeight: "600" }}>{data?.name} </Text>
                                <Text style={{ color: "#536279" }}>
                                    {data?.packetDescription}
                                </Text>
                            </Row>
                        </Row>
                    </Col>

                    <Col span={10} className="left-item">
                        <Row style={{ flexDirection: "column" }}>
                            <Text style={{ fontWeight: "600" }}>مبلغ </Text>
                            <Text style={{ color: "#536279" }}>
                                {
                                    typeof data?.payment == "string" ? 0 :
                                        NumberConverter.formatNumberWithCommas(Number(data?.payment))} ریال
                            </Text>
                        </Row>
                    </Col>
                </Row>
            </div>

            {/* DETAILS CARD */}
            <Card className="details-card">
                <div className="info-row">
                    <span>نام مشتری</span>
                    <span>{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
                </div>

                <div className="info-row">
                    <span>تاریخ شروع</span>
                    <span > {renderJalaliDate(data?.startDate)}</span>
                </div>

                <div className="info-row">
                    <span>تاریخ پایان</span>
                    <span>
                        {renderJalaliDate(data?.endDate)}
                    </span>

                </div>

                <div className="info-row tracking-row">
                    <span>شماره پیگیری</span>

                    <div className="tracking">
                        {
                            data?.trackingNumber == "" ? null :
                                <CopyOutlined style={{ color: "red" }} onClick={handleCopy} />
                        }
                        <span>{data?.trackingNumber == "" ? "-" : data?.trackingNumber}</span>


                    </div>
                </div>

                <div className="info-row">
                    <span>شماره مرجع</span>
                    <span>{data?.referenceNumber == "" ? "-" : data?.referenceNumber}</span>
                </div>
            </Card>

            {/* FACTOR CARD */}
            <Card className="factor-card">
                <div
                    className="collapse-header"
                    onClick={() => setOpen(!open)}
                >
                    <span>جزئیات تعداد فاکتور</span>
                    {
                        open ?
                            <UpOutlined
                                className={`arrow ${open ? "open" : ""}`}
                            />
                            :
                            <DownOutlined className={`arrow ${open ? "open" : ""}`} />
                    }


                </div>

                {open && (
                    <div className="collapse-body">
                        <div className="info-row">
                            <span>کل</span>
                            <span>{data?.totalCount == "" ? "-" : data?.totalCount} عدد</span>
                        </div>

                        <div className="info-row">
                            <span>استفاده شده</span>
                            <span>{data?.usedQuantity == "" ? "-" : data?.usedQuantity} عدد</span>
                        </div>

                        <div className="info-row">
                            <span>باقی مانده</span>
                            <span>{data?.remainedQuantity == "" ? "-" : data?.remainedQuantity} عدد</span>
                        </div>
                    </div>
                )}
            </Card>

            {/* FOOTER BUTTON */}
            {/* <div className="buttonContainer"> */}
                {/* <Button

                    type="primary"
                    size="large"
                    className="buttons-styles"
                    style={{ width: "100%" }}
                    onClick={handleGuideLink}
                >
                    مشاهده راهنما
                </Button> */}

                    <Row className="buttonContainer" align={"middle"}>
                                    <Col span={12}>
                                        <Button
                                            type="text"
                                            className="filter-actions__cancel"
                                            onClick={() => onClose()}
                                        >
                                            بستن
                                        </Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button
                                            type="primary"
                                            className="filter-actions__apply"
                                                onClick={handleGuideLink}
                                        >
                                            مشاهده راهنما
                                        </Button>
                                    </Col>
                
                
                                </Row>
            {/* </div> */}
        </div>
    );
};

export default MobileViewDetails;
