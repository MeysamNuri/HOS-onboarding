import { Card, Typography, Button, Row, Image } from 'antd'
import guides1 from '@core/assets/images/guides/guides-1.svg'
import guides2 from '@core/assets/images/guides/guides-2.svg'
import step1 from '@core/assets/icons/guide-step1.svg'
import step2 from '@core/assets/icons/guide-step2.svg'
import notice from '@core/assets/icons/notification_settings.svg'
import './styles/activationInstructions.scss'
import { useMemo } from 'react';

const { Title, Paragraph } = Typography

export default function ActivationGuideInstructions() {

    const handleNavigation = (link: string) => {
        window.location.href = link
    }
    const guideCards = useMemo(
        () => [
            {
                image: guides1,
                icon: step1,
                title1: " مرحله ی اول",
                title2: " دریافت کد از نرم افزار هلو",
                description:
                    "به «هلو» مراجعه کرده و از نوار کناری، آیکون «کره‌زمین/شبکه» را انتخاب کنید.سپس وارد «کد فعال‌سازی خدمات هوشمند» شده و در تب «هلو لند»، “کد اتصال به هلو” نمایش‌داده‌شده استسپس روی لینک آبی کلیک کرده یا کد را در صفحه «رمز یک‌بارمصرف» (مرحله 2) وارد نمایید."
            },
            {
                image: guides2,
                icon: step2,
                title1: "مرحله دوم",
                title2: "صفحه اتصال به هلو",
                buttonText: "اتصال به هلو",
                link: "https://portfolio.invalid/device-auth",
                description:
                    "بر روی دکمه “اتصال به هلو” ضربه بزنید و کد دریافت شده از نرم افزار هلو را وارد کنید."
            },
            {

                title1: "عدم نمایش مراحل",
                title2: "اشتراک گذاری پیش فاکتور با مشتری",
                icon: notice,
                buttonText: "راهنمای بروزرسانی نرم افزار هلو",
                description:
                    "اگر مرحله فوق را مشاهده نمی‌کنید، نرم‌افزار هلو را به آخرین نسخه به‌روزرسانی کنید.",

            },
        ],
        []
    );
    return (
        <Row align="middle" className="activation-instruction" >
            {
                guideCards?.map((card, index) => (
                    <Card key={index} className="step-card" >
                        {
                            card.image ?
                                <Image
                                    src={card.image}
                                    width="100%"
                                    preview={false}
                                    className="sendInvoice-guide__image"
                                /> : null
                        }

                        <div className="step-card__header">

                            <div className="step-card__number"><img src={card.icon} /></div>

                            <Title level={5} className="step-card__title">
                                {card?.title1}
                            </Title>
                        </div>

                        <Title level={5} className="step-card__subtitle">
                            {card?.title2}
                        </Title>

                        <Paragraph className="step-card__description">
                            {card.description}
                        </Paragraph>
                        {
                            card.buttonText ?
                                <Button onClick={() => handleNavigation(card.link ?? "")} type="primary" size="large" block className="buttons-styles">
                                    {card.buttonText}
                                </Button> : null
                        }

                    </Card>

                ))
            }

        </Row>
    )
}
