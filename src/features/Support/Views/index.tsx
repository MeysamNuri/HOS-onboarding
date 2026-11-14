import { Row, Col, Button } from "antd";

import { LeftOutlined } from "@ant-design/icons";
import Bale from "@core/assets/icons/bale.svg"
import Phone from "@core/assets/icons/phone.svg"

import Agent from "@core/assets/icons/support_agent.svg"
import SupportBanners from "./SupportBanners";
import "./styles.scss"
import PagesHeader from "@/core/components/pagesHeader";
import useSupportHooks from "../Hooks/SupportHooks";


export default function Support() {

    const { isDesktop, quickAccessList, handleQuickNavigate } = useSupportHooks()
    return (
        <Row style={{ width: "100%" }}>

            <Col span={24} >
                <div className="page-container">
                    <PagesHeader text="  مرکز پشتیبانی و خدمات هوشمند هلو" title=" پشتیبانی" />
                    <h3 className="quick-access-title" >
                        دسترسی سریع
                    </h3>
                    <div className="quick-access-list">
                        {quickAccessList.map((item) => {
                            const isHelpItem = item.link === "/sendLink-help";

                            return (
                                <div
                                    key={item.link}
                                    className="quick-access-list__card"
                                    style={isHelpItem ? { backgroundColor: "#FFEBEB" } : undefined}
                                    onClick={() => handleQuickNavigate(item.link)}
                                >
                                    <div className="quick-access-list__icon">
                                        <img src={item.icon} alt={item.title} />
                                    </div>

                                    <div className="quick-access-list__title">
                                        {item.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <SupportBanners />
                    <Row className="support-banner" align="middle" justify="space-between">
                        <Col sm={24} xs={24} md={20}>
                            <div className="support-banner__content">
                                <div className="support-banner__header">
                                    <img src={Bale} className="support-banner__icon" width={30} />

                                    <div>
                                        <div className="support-banner__text">
                                            <h3 className="support-banner__title">
                                                پیام رسان بله
                                            </h3>

                                            <span className="support-banner__status">
                                                ۲۴/۷ پشتیبانی
                                            </span>
                                        </div>

                                        <p className="support-banner__description">
                                            پاسخگویی خیلی سریع و همیشه در دسترس در پیام رسان بله
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} md={4}>
                            {
                                isDesktop ?
                                    <a
                                        href="https://portfolio.invalid/holooonline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            block
                                            type="text"
                                            className="support-banner__button"

                                        >
                                            شروع گفتگو
                                            <LeftOutlined />
                                        </Button>
                                    </a> :

                                    <div style={{ textAlign: "left", marginTop: "16px" }}>
                                        <a
                                            href="https://portfolio.invalid/holooonline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="external-link"
                                        >

                                            شروع گفتگو
                                            <LeftOutlined style={{ marginRight: "10px" }} />
                                        </a>
                                    </div>

                            }

                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} className="support-cards">
                        <Col xs={24} md={12}>
                            <div className="support-cards__box">
                                <img src={Phone} className="support-banner__icon" />

                                <div className="support-cards__text">

                                    <h3>تماس تلفنی</h3>

                                    <Row>

                                        <Col xs={24} sm={12}>
                                            <p>
                                                شعبات فعال در سراسر کشور
                                            </p>
                                        </Col>
                                        <Col xs={24} sm={12} className="support-phone">
                                            <p >
                                                00000000000
                                            </p>
                                            <a href="tel:00000000000"
                                                rel="noopener noreferrer">
                                                <Button className="buttons-outLine" style={{ marginTop: "8px", backgroundColor: "transparent" }}>
                                                    <img src={Phone} className="support-banner__icon" width={18} />
                                                    تماس بگیرید

                                                </Button>
                                            </a>
                                        </Col>

                                    </Row>


                                </div>

                            </div>
                        </Col>

                        <Col xs={24} md={12}>
                            <div className="support-cards__box" >
                                <img src={Agent} className="support-banner__icon" />

                                <div className="support-cards__text">
                                    <h3>گفتگو با کارشناس</h3>

                                    <p>
                                        ارتباط مستقیم آنلاین با تیم فنی و کارشناسان هلو
                                    </p>
                                    <Row justify={"end"}  >
                                        <Button disabled className="buttons-outLine" style={{ marginTop: "8px", backgroundColor: "transparent", opacity: ".5" }} >

                                            گفتگو با کارشناسان

                                        </Button>
                                    </Row>
                                </div>

                            </div>

                        </Col>
                    </Row>
                </div>
            </Col>

        </Row>
    )
}
