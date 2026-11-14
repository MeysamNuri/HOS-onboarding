import { Row, Typography, Col, Card, Button, Spin, Alert } from "antd";
import OrderDetailsError from "@/features/Services/components/orderDetailsError";

import { Link } from 'react-router'
import { motion } from "framer-motion";
import "./styles.scss"
import useHomePageHooks from "../hooks/homePageHooks";
import Lottie from "lottie-react";

import glowLoading from "@core/assets/icons/Glow-loading.json";
import BottomModal from "@/core/components/customModal";
import ChooseSerialModal from "../../../core/components/chooseSerialModal";
import PagesHeader from "@/core/components/pagesHeader";
import BannerCarousel from "@/core/components/bannerCarousel";
import {
  LeftOutlined
} from "@ant-design/icons";

const { Title } = Typography


export default function HomePage() {
  const { cards,
    handleOpenModal,
    openModal,
    catalog,
    selectedPlan,
    hamrahActivation,
    handleCloseModal,
    isDesktop
  } = useHomePageHooks()



  return (
    <Row style={{ width: "100%" }}>


      <Col span={24} >

        <div className="page-container">
          <PagesHeader title="خدمات آنلاین نرم افزار هلو " text="در راستای توسعه خدمات و تسهیل دسترسی کاربران، سرویس‌های آنلاین هلو به‌تدریج فعال می‌شوند تا تجربه‌ای ساده و کارآمد از این پس در دسترس شما باشد
"/>
          <BannerCarousel />

          <Row className="Home-page" justify="center">
            {
              isDesktop ?
                <section className="features-section">
                  <Row gutter={[16, 16]}>
                    {cards?.map((card, index) => (
                      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8} key={index}>
                        <motion.div
                          style={{ height: "100%" }}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.15 }}
                          viewport={{ once: true }}
                        >
                          <Card className={`feature-card ${card.active ? "active-card" : " simple-card"} `} bordered={false} >
                            <div className="icon-wrapper">{card.icon}</div>

                            <div className="header-row">
                              <Title level={5}>{card.title}</Title>
                              {
                                !card.active ?
                                  <div className="pending-badge">
                                    <Lottie animationData={glowLoading} loop={true} style={{ width: "35px", height: "35px" }} />

                                    <span >در حال انتشار
                                    </span>

                                  </div> : null
                              }

                            </div>
                            <p className="descrption">{card.description}</p>

                            <div className="actions" >
                              <Button
                                style={{ width: "50%" }}

                                disabled={!card.active} size="large" className={!card.active ? '' : 'buttons-styles'} onClick={() => handleOpenModal(card.link)}> فعالسازی</Button>
                              <Link to={`/${card.link}`}>
                                <Button disabled={card?.link == "AI" ? true : !card.active} style={{ color: card?.link !== "AI" && card.active ? "#ff0000" : "" }} size="large" type="text" >اطلاعات بیشتر </Button>
                              </Link>
                            </div>
                          </Card>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </section> :


                //mobile view==========

                <Row gutter={[0, 36]} style={{ margin: "30px 0" }}>
                  {cards?.map((card, index) => (
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8} key={index}>
                      <motion.div
                        style={{ height: "100%" }}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        viewport={{ once: true }}
                      >

                        <Card className={`mobile-feature-card ${card.active ? "active-card" : " simple-card"} ${index % 2 !== 0 ? "right-side" : "left-side"} `} bordered={false} >
                          <Row>
                            {
                              index % 2 === 0 &&
                              <Col span={5}>
                                <div className="icon-wrapper">{card.icon}</div>

                              </Col>
                            }

                            <Col span={19}>

                              <div className="header-row" >
                                <Title level={5}>{card.title}</Title>
                                {
                                  !card.active ?
                                    <div className="pending-badge">
                                      <Lottie animationData={glowLoading} loop={true} style={{ width: "25px", height: "25px" }} />

                                      <span style={{ fontSize: "12px" }}>در حال انتشار
                                      </span>

                                    </div> : null
                                }

                              </div>
                              <p className="descrption">{card.description}</p>


                            </Col>

                            {
                              index % 2 !== 0 &&
                              <Col span={4}>
                                <div className="icon-wrapper">{card.icon}</div>

                              </Col>
                            }
                          </Row>
                          <Row justify={"end"}>

                            <Col span={19} >
                              {
                                !card?.active ? null :
                                  <div className="actions">
                                    <Button
                                      style={{ fontSize: "12px", width: "45%" }}
                                      size="middle" className={!card.active ? '' : 'buttons-styles'} onClick={() => handleOpenModal(card.link)}>
                                      فعالسازی
                                      <LeftOutlined />

                                    </Button>
                                    <Link to={`/${card.link}`}>
                                      <Button disabled={card?.link == "BI" ? true : !card.active} style={{ color: card?.link !== "BI" && card.active ? "#ff0000" : "", fontSize: "12px" }} size="middle" type="text" >اطلاعات بیشتر </Button>
                                    </Link>
                                  </div>
                              }
                            </Col>
                          </Row>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
            }



            <BottomModal open={openModal} onClose={handleCloseModal} fitContent>
              {catalog.isLoading ? <Spin aria-label="در حال دریافت اطلاعات بسته" /> : selectedPlan ? (
                <ChooseSerialModal packetCode={selectedPlan.code} onCancel={handleCloseModal} onSubmit={hamrahActivation.handleSubmit} isSubmitting={hamrahActivation.isSubmitting} />
              ) : <Alert type="error" title="بستهٔ پایه در دسترس نیست." action={<Button onClick={() => void catalog.refetch()}>تلاش مجدد</Button>} />}

            </BottomModal>
            <BottomModal open={Boolean(hamrahActivation.errorResult)} onClose={hamrahActivation.closeError} showHandler={false} height="100vh">
              <OrderDetailsError
                onClose={hamrahActivation.closeError}
                messages={hamrahActivation.errorResult?.messages}
                orderDetailsData={hamrahActivation.errorResult?.orderDetails}
                selectedPlan={hamrahActivation.errorResult?.selectedPlan}
                serviceCode={hamrahActivation.errorResult?.serviceCode}
                actionLabel={localStorage.getItem("serviceCode") === "sendLink" ? "مشاهده بسته ها" : undefined}
                onAction={localStorage.getItem("serviceCode") === "sendLink" ? () => {
                  hamrahActivation.closeError();
                  hamrahActivation.navigate("/quickrenew?packetcode=OneMonth2000-3&mtm_source=holooSendLinkLanding&mtm_medium=CTA&mtm_campaign=holooSendLinkLanding");
                } : undefined}
              />
            </BottomModal>

          </Row>
        </div>
      </Col>
    </Row>
  )
}
