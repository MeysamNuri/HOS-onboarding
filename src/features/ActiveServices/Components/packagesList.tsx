import { Button, Card, Progress, Empty, Row, Col } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import "./styles/packagesList.scss";
import SendInvoice from "@core/assets/icons/sendInvoice-Icon.svg";
import BI from "@core/assets/icons/BI-icon.svg";
import AI from "@core/assets/icons/AI-icon.svg";
import type { IActiveServicesItems } from "../types";
import { renderJalaliDate } from "@/core/helper/dateConverter";
import EmptyData from "@core/assets/images/empty-list.svg"

// Constants for better maintainability
const SERVICE_ICONS = {
    SendInvoice: SendInvoice,
    BI: BI,
    AI: AI,
} as const;

const SERVICE_LABELS = {
    SendInvoice: "تعداد کل",
    BI: "نوع بسته",
    AI: "نوع بسته",
} as const;

type ServiceType = keyof typeof SERVICE_ICONS;

const SERVICE_CODES: Record<ServiceType, number> = {
    SendInvoice: 3,
    BI: 2,
    AI: 1,
};

interface IPackageListProps {
    dataList: IActiveServicesItems[] | undefined,
    hasReservedPackage: (serviceDescription: string) => boolean
}

const PackagesList: React.FC<IPackageListProps> = ({ dataList, hasReservedPackage }) => {
    const navigate = useNavigate();

    const handleBuyReservedPackage = (packetCode: string, serviceType: ServiceType) => {
        const defaultPacketCode = `OneMonth2000-${SERVICE_CODES[serviceType]}`;
        const searchParams = new URLSearchParams({
            packetcode: packetCode || defaultPacketCode,
            mtm_source: "PackagesStatePage",
            mtm_medium: "CTA",
            mtm_campaign: "PackagesState",
        });

        navigate(`/quickrenew?${searchParams.toString()}`);
    };

    if (!dataList?.length) {
        return <div style={{ margin: "40px auto" }}>
            <Empty
                image={EmptyData}
                description="اطلاعاتی برای نمایش وجود ندارد"
            />
        </div> // or return a placeholder/empty state if needed
    }

    const getServiceType = (serviceDescription: string): ServiceType => {
        if (serviceDescription === "SendInvoice") return "SendInvoice";
        if (serviceDescription === "BI") return "BI";
        return "AI";
    };

    return (

        <div className="packages-page">
            <Row  gutter={[16,0]}>

                {

                    dataList?.map((item, index) => {
                        const serviceType = getServiceType(item.serviceDescription);
                        const icon = SERVICE_ICONS[serviceType];
                        const label = SERVICE_LABELS[serviceType];
                        const value = serviceType === "SendInvoice" ? item.totalCount : item.packageTitle;
                        const remainUnit = "عدد";
                        const totalUnit = serviceType === "SendInvoice" ? "عدد" : "";
                        const remainingDays = item?.remainingDays ?? 0;
                        const durationDays = Number(item?.durationDays);
                        const progressPercent = durationDays > 0
                            ? Math.min(100, Math.max(0, Math.round((Number(item?.remainingDays) / durationDays) * 100)))
                            : 0;
                        const progressColor = progressPercent >= 60
                            ? "#168528"
                            : progressPercent > 20
                                ? "#ffc43d"
                                : "#ba0000";

                        return (

                            <Col key={`${item.serviceDescription}-${item.name}-${index}`} xs={24} sm={24} md={12} lg={12} style={{ width: "100%" }}>
                                <Card className="package-card">
                                    {/* HEADER */}

                                    <div className="card-header">
                                        <div className="header-icon">
                                            <img src={icon} alt={serviceType} />
                                        </div>
                                        <div className="header-right">
                                            <div className="title">{item.name}</div>
                                            <div className="days">{item.packageDescription}</div>
                                        </div>
                                    </div>

                                    {/* BODY */}
                                    <div className="card-body">
                                        <div className="card-main-content">
                                            <div className="info-section">
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <span className="label">{label}</span>
                                                        <span className="value">{value}
                                                            <span className="value-unit">{totalUnit}</span>

                                                        </span>

                                                    </div>
                                                    {
                                                        serviceType === "SendInvoice" &&
                                                        <div className="info-item">
                                                            <span className="label">باقی مانده</span>
                                                            <span className="value">{item.remainedQuantity}

                                                                <span className="value-unit">{remainUnit}</span>
                                                            </span>

                                                        </div>
                                                    }

                                                </div>
                                            </div>

                                            {!hasReservedPackage(item.serviceDescription) && (
                                                <Button
                                                    className="reserve-package-button"
                                                    disabled={item.serviceDescription!=="SendInvoice"?true:false}
                                                    style={item.serviceDescription!=="SendInvoice"?{opacity:".5"}:{}}
                                                    onClick={() => handleBuyReservedPackage(item.packetCode, serviceType)}
                                                >
                                                    خرید بسته رزرو
                                                    <LeftOutlined />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="progress-wrapper">
                                            <Progress
                                                type="circle"
                                                percent={progressPercent}
                                                width={96}
                                                strokeWidth={10}
                                                trailColor="#e5e5e5"
                                                strokeColor={progressColor}
                                                format={() => (
                                                    <div className="circle-content">
                                                        <div className="days-number" style={{ color: progressColor }}>
                                                            {remainingDays} روز
                                                        </div>
                                                        <div className="days-text">باقی مانده</div>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* FOOTER */}
                                    <div className="card-footer">
                                        <span>تاریخ شروع: {renderJalaliDate(item.startDate).split("-")[1]}</span>
                                        <span>تاریخ انقضا: {renderJalaliDate(item.endDate).split("-")[1]}</span>
                                    </div>

                                </Card>
                            </Col>
                        );
                    })
                }
            </Row>
        </div>

    );
};

export default PackagesList;
