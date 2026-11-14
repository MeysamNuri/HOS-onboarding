import { Button, Col, Row, Typography } from "antd";
import PDF from '@core/assets/icons/pdf-icon.svg'
import { LeftOutlined } from "@ant-design/icons";
import notice from '@core/assets/images/notification_settings.svg'
import holooLogo from '@core/assets/images/holoo.png'
import Arrow from '@core/assets/icons/arrow-right.svg'
import "./styles/sendInvoiceGuide.scss"
import OrderDetailsModal from "./orderDetailsModal";
import BottomModal from "@/core/components/customModal";
import { ShareAltOutlined } from "@ant-design/icons";

import ApplyInstructions from "./applyInstructions";
import useGuidHooks from "../hooks/guideHooks";
import OrderDetailsErrors from "./orderDetailsError";

const guideContent = {
    1: {
        mobileTabTitle: "ارسال فاکتور آنلاین",
        contextTitle: "راهنمای استفاده ارسال فاکتور آنلاین",
        pdfTitle: "PDF راهنمای استفاده فاکتور آنلاین",
        pdfDescription: "مراحل راه‌اندازی و ارسال فاکتور را با دانلود PDF نزد خود داشته باشید",
        coverTitle: "راهنمای ارسال فاکتور آنلاین",
    },
    2: {
        mobileTabTitle: "ارسال معین اشخاص آنلاین",
        contextTitle: "راهنمای استفاده ارسال معین اشخاص آنلاین",
        pdfTitle: "PDF راهنمای استفاده معین اشخاص",
        pdfDescription: "مراحل راه‌اندازی و ارسال معین اشخاص را با دانلود PDF نزد خود داشته باشید",
        coverTitle: "راهنمای ارسال معین اشخاص",
    },
    3: {
        mobileTabTitle: "نصب نسخه جدید هلو",
        contextTitle: "راهنمای نصب نسخه جدید هلو",
        pdfTitle: "PDF راهنمای نصب نسخه جدید هلو",
        pdfDescription: "مراحل نصب و به‌روزرسانی نرم‌افزار هلو را با دانلود PDF نزد خود داشته باشید",
        coverTitle: "راهنمای نصب نسخه جدید هلو",
    },
} as const;


export default function SendInvoiceGuide() {


    const {
        showOrderDetails,
        handleCancelModal,
        checkPaymentLoading,
        orderDetailsLoading,
        orderDetailsData,
        checkPaymentResult,
        paymentErrorModal,
        handleCloseErrormodal,
        isDesktop,
        handleSetting,
        handleDownloadPDF,
        handleMobileDownloadPDF,
        handleSharePDF,
        handleGuideBack,
        navigate,
        guideFeatureList,
        selectedTab,
        setSelectedTab,
        onInstallGuide

    } = useGuidHooks()
    const { Paragraph, Title } = Typography;
    const activeGuide = guideContent[selectedTab.id as keyof typeof guideContent] ?? guideContent[1];

    return (
        <Row className="send-invoice-guide-shell" style={{ width: "100%" }}>


            <Col span={24} >
                <div className="page-container send-invoice-guide-page">
                    <div className="send-invoice-guide-page__content">
                    <header className="send-invoice-guide-page__header">
                        <div className="send-invoice-guide-page__heading">
                            <button
                                type="button"
                                className="send-invoice-guide-page__back"
                                onClick={handleGuideBack}
                                aria-label="بازگشت"
                            >
                                <img src={Arrow} alt="" aria-hidden="true" />
                            </button>
                            <div>
                                <h1>راهنمای استفاده</h1>
                                <p>ابتدا تنظیمات را تکمیل کنید، سپس با مطالعه این راهنما فرآیند ارسال را به‌سادگی آغاز نمایید</p>
                            </div>
                        </div>

                        <Button className="send-invoice-guide-page__settings-button" onClick={handleSetting}>
                            تنظیمات
                        </Button>
                    </header>
                    <div className="send-invoice-guide-page__tabs" role="tablist" aria-label="بخش‌های راهنما">
                        {guideFeatureList.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={selectedTab.id === item.id}
                                onClick={() => setSelectedTab(item)}
                                className={
                                    selectedTab.id === item.id
                                        ? "guide-tab guide-tab--active"
                                        : "guide-tab"
                                }
                            >
                                <span className="guide-tab__desktop-label">{item.value}</span>
                               
                            </button>
                        ))}
                    </div>

                    <div className="send-invoice-guide-page__mobile-context">
                        <strong>{activeGuide.contextTitle}</strong>
                        <button type="button" onClick={handleSetting}>
                            تنظیمات
                            <LeftOutlined />
                        </button>
                    </div>

                    <section className="guide-download-card" aria-labelledby="guide-download-title">
                        <div className="guide-download-card__cover" aria-hidden="true">
                            <img src={holooLogo} alt="" />
                            <span>{activeGuide.coverTitle}</span>
                            <span className="guide-download-card__cover-badge">PDF</span>
                        </div>

                        <div className="guide-download-card__content">
                            <h2 id="guide-download-title">{activeGuide.pdfTitle}</h2>
                            <p>{activeGuide.pdfDescription}</p>
                            <Button  className="guide-download-card__button" onClick={isDesktop ? handleDownloadPDF : handleMobileDownloadPDF}>
                                <img src={PDF} alt="" aria-hidden="true" />
                                دانلود راهنما
                            </Button>
                        </div>
                    </section>

                    <ApplyInstructions
                        selectedTabId={selectedTab.id}

                    />
                    {
                        selectedTab.id !== 3 &&
                        <div className="sendInvoice-guide__update-card">
                            <div className="sendInvoice-guide__update-title sendInvoice-guide__update-title">
                                <img src={notice} alt="" aria-hidden="true" />
                                <Title level={5}>عدم نمایش مراحل</Title>
                            </div>

                            <Paragraph className="sendInvoice-guide__desktop-copy">
                                اگر امکان ارسال {selectedTab.id===1?"فاکتور آنلاین":selectedTab.id===2?"معین اشخاص":""} در نرم‌افزار هلو وجود ندارد، نرم‌افزار هلو را به آخرین نسخه به‌روزرسانی کنید.
                            </Paragraph>


                            <Paragraph className="sendInvoice-guide__version">
                                نسخه شامل {selectedTab.id===1?"فاکتور آنلاین":selectedTab.id===2?"معین اشخاص":""} : "۹.۶۱" به بالا، تاریخ "۲۵ شهریور ۱۴۰۵" به بعد
                            </Paragraph>

                            <Button className="sendInvoice-guide__install-button" onClick={onInstallGuide}>
                                نصب نسخه جدید هلو
                                <LeftOutlined />
                            </Button>
                        </div>
                    }


                    {/* Submit Button */}
                    </div>

                    <Row className="senLink-guide-buttons" align="middle" gutter={16}>
                        <Col xs={24} sm={12}>
                            <Button className="senLink-guide-buttons__share" onClick={handleSharePDF}>
                                <ShareAltOutlined />
                                اشتراک گذاری
                            </Button>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Button
                                type="primary"
                                className="senLink-guide-buttons__download"
                                onClick={handleMobileDownloadPDF}
                            >
                                <img src={PDF} alt="" aria-hidden="true" />
                                دانلود راهنما
                            </Button>
                        </Col>
                    </Row>

                    <div className="send-invoice-guide-page__share">
                        <Button size="small" className="buttons-styles" onClick={handleSharePDF}>
                            <ShareAltOutlined />
                            اشتراک گذاری
                        </Button>
                    </div>

                    <BottomModal
                        open={showOrderDetails}
                        onClose={handleCancelModal}
                        showHandler={false}
                        height='100vh'
                        width="680px"
                 
                    >
                        <OrderDetailsModal
                            onCancel={handleCancelModal}
                            orderDetailsLoading={orderDetailsLoading}
                            checkPaymentLoading={checkPaymentLoading}
                            orderDetailsData={orderDetailsData?.Data}
                            checkPaymentResult={checkPaymentResult?.Data}

                        />
                    </BottomModal>
                    <BottomModal  open={paymentErrorModal} onClose={handleCloseErrormodal} 
                      showHandler={false}
                        height='100vh'
                    >
                        <OrderDetailsErrors
                            messages={checkPaymentResult?.Message?.length ? checkPaymentResult.Message : checkPaymentResult?.Data?.title}
                            onClose={handleCloseErrormodal}
                            title={"متأسفانه فعال‌سازی بسته انجام نشد"}
                            actionLabel="مشاهده بسته ها"
                            onAction={() => {
                                handleCloseErrormodal();
                                navigate("/quickrenew?packetcode=OneMonth2000-3&mtm_source=holooSendLinkLanding&mtm_medium=CTA&mtm_campaign=holooSendLinkLanding");
                            }}
                        />
                    </BottomModal>
                </div>
            </Col>
        </Row>
    )
}
