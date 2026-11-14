import { Row, Col, Typography, Button, Image } from 'antd'
import invoice from '@core/assets/images/invoice-pic.svg'
import homeHero from '@core/assets/images/home-hero-pic.svg'
import biReport from '@core/assets/images/BI-hero-pic.svg'
import airobat from '@core/assets/images/ai-robat.svg'
import type { IPlansProps } from '../types/models'
import { Link } from 'react-router'

import "./styles/plansHero.scss"
const { Title } = Typography




export default function PlansHero({ path, handleInvoiceDemoModal }: IPlansProps) {

    return (

        <>

            <Row className='plans-hero' >
                <Col xs={24} sm={24} md={{ span: 12, offset: 2 }}>
                    <div className='plans-hero__texts'>

                        <div>
                            {
                                path === "home" ? "" :
                                    path === "BI" ?
                                        <Title level={5}>
                                            هلو همراه
                                        </Title> :
                                        path === "sendLink" ?
                                            <Title level={5}> اشتراک آنلاین اسناد  </Title>
                                            :
                                            <Title level={5}>  هوش مصنوعی هلو </Title>

                            }
                        </div>
                        <div>
                            {
                                path === "home" ?
                                    <Title level={3}>آغاز خدمات آنلاین <span style={{ color: "#ff0000" }}>هلو</span></Title>
                                    :
                                    path === "BI" ?
                                        <Title level={2}> مدیریت لحظه ای کسب و کار در موبایل

                                        </Title> :
                                        path === "sendLink" ?
                                            <Title level={2} className='main-title'> خدمات اشتراک آنلاین اسناد هلو </Title>
                                            :
                                            <Title level={2} className='main-title'>خدمات هوش مصنوعی هلو</Title>

                            }
                        </div>
                        {
                            path === "home" ?

                                <Typography className='header-text'>داده‌های هلو را به تصمیمات سودآور تبدیل کنید
                                    با هوش تجاری هلو، گزارش‌های هوشمند، تحلیل‌های عمیق و دسترسی همیشگی از طریق موبایل را تجربه خواهید کرد.</Typography> :
                                path === "BI" ?
                                    <Typography className='header-text'>
                                        هلو همراه به شما امکان می‌دهد بدون نیاز به حضور در محل کار، گزارش‌های مهم مالی و وضعیت فروش را در موبایل خود بررسی کنید.</Typography>
                                    : path === "sendLink" ?
                                        <Typography className='header-text'>به راحتی یک کلیک ، لینک آنلاین مشاهده پیش فاکتور / فاکتور ثبت شده در نرم افزار حسابداری هلو را به مشتری خود پیامک کنید . </Typography>
                                        :

                                        <Typography className='header-text'>داده‌های هلو را به تصمیمات سودآور تبدیل کنید
                                            با هوش تجاری هلو، گزارش‌های هوشمند، تحلیل‌های عمیق و دسترسی همیشگی از طریق موبایل را تجربه خواهید کرد.</Typography>
                        }

                        <div className='plans-hero__buttons'>

                            {
                                path === "home" ?


                                    <Link to={`/sendLink`} style={{ width: "100%" }}>
                                        <Button size="large" className="buttons-styles">
                                            اطلاعات بیشتر
                                        </Button>
                                    </Link>

                                    :
                                    path === "sendLink" ?
                                        <Button size="large" className="buttons-styles" onClick={handleInvoiceDemoModal}>
                                            دیدن نمونه فاکتور
                                        </Button> :
                                        path === "BI" ?
                                            <>
                                                <Button size="large" className="buttons-styles" onClick={handleInvoiceDemoModal}>
                                                    مشاهده دمو هلو همراه
                                                </Button>
                                                <Button size="large" className="buttons-outLine" onClick={handleInvoiceDemoModal}>
                                                    تجربه نسخه آزمایشی
                                                </Button>
                                            </>
                                            : null
                            }

                        </div>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={8} style={{ width: "100%" }}>
                    <div className='plans-hero__image'>
                        <Image src={
                            path === "home" ? homeHero :
                                path === "BI" ? biReport :
                                    path === "sendLink" ?
                                        invoice : path === "AI" ? airobat : ""} preview={false} />
                    </div>
                </Col>

            </Row>
        </>
    )
}
