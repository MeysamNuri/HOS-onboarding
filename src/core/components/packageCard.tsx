import { Button, Col, Row } from "antd";
import { NumberConverter } from "../helper/numberConverter"
import {
    //  durationMap,
    type IServicePacketOBG
} from "../types/models"
import { CheckCircleFilled, LeftOutlined } from "@ant-design/icons";
import Attention from '@core/assets/icons/red-attention.svg'
import LeftArrow from '@core/assets/icons/left-arrow-red.svg'

interface IPackageCardProps {
    duration: string | number
    plan: IServicePacketOBG,
    agentCode?: boolean,
    selectedPlan: IServicePacketOBG | undefined,
    activationLoading: boolean,
    isMobileCard?: boolean,
    isOthersPackage?: boolean,
    hanleOpenModal: (value: IServicePacketOBG) => void,
    handleClosePackageDetail?: () => void,
    openPackageDetailModal?: boolean,
    setOpenPackageDetailsModal?: React.Dispatch<React.SetStateAction<boolean>>

}

export default function PackageCard({
    plan,
    //  duration,
    selectedPlan,
    activationLoading,
    hanleOpenModal,
    isMobileCard,
    isOthersPackage,

    setOpenPackageDetailsModal, }: IPackageCardProps) {
    // const months = Number(duration) / 30;
    // const convertedDuration = durationMap[months] ?? "";

    return (
        <div className="desktop-package-card">

            <div
                className="desktop-package-card__top-line"
                style={{ background: plan?.color === "" || !plan?.color ? "red" : plan?.color }}
            />

            <div className="desktop-package-card__content">

                <div className="desktop-package-card__header">


                    <div className="desktop-package-card__title">

                        <div>
                            <h3>{NumberConverter.latinToArabic(plan.name)}</h3>
                            <span> {plan.lable}</span>
                            {
                                isMobileCard &&
                                <span>/ {
                                    plan.featureList?.map((feature) => (


                                        <span>{feature}</span>
                                    ))}
                                </span>
                            }

                        </div>
                    </div>
                    <span className={plan.type === "Normal" ? "desktop-package-card__badge" : "desktop-package-card__badge2"}>
                        {plan.type === "Normal" ? "ویژه کاربران عادی" : "ویژه کاربران پرمصرف"}
                    </span>

                </div>

                <div className={isMobileCard ? "desktop-package-card__mobile-price" : "desktop-package-card__price"}>

                    <Row>
                        <Col span={14}>
                            <div className="details-modal" onClick={() => setOpenPackageDetailsModal && setOpenPackageDetailsModal(true)}>
                                <img src={Attention} />
                                <span>جزئیات بسته</span>
                                <img src={LeftArrow} />


                            </div>
                        </Col>
                        <Col span={10}>
                            {!!plan.basePrice && plan.basePrice !== plan.salesPrice && (
                                <div className="old-price">
                                    {NumberConverter.latinToArabic(
                                        NumberConverter.formatNumberWithCommas(
                                            Number(plan.basePrice ?? 0) / 10
                                        )
                                    )}                                  {" "}
                                    تومان
                                </div>
                            )}
                        </Col>


                    </Row>
                    <div className="new-price">
                        {
                            isMobileCard &&
                            <span className="discount" style={{ marginLeft: "10px" }}> %{plan.discountPercent}تخفیف به مدت محدود</span>

                        }
                        {
                            plan.salesPrice == 0 ? "رایگان" :
                                <span>
                                    {NumberConverter.latinToArabic(NumberConverter.formatNumberWithCommas(plan.salesPrice / 10)) }
                                    {" "}
                                    تومان
                                </span>
                        }
                    </div>

                    {
                        !isMobileCard &&
                        plan.basePrice !== plan.salesPrice && (
                            <div className="discount">
                                <span style={{ marginRight: "2px" }}>   %</span>
                                {NumberConverter.latinToArabic(plan.discountPercent)}
                                {" "}
                                <span className="discount__text">تخفیف به مدت محدود</span>
                            </div>
                        )}

                </div>

                <div className={isOthersPackage ? "divider-left" : "divider"} />

                <div className="desktop-package-card__features">
                    {!isOthersPackage &&
                        <span className="description">{plan?.description == "" ? "-" : plan?.description}</span>

                    }
                    {
                        !isMobileCard &&
                        plan.featureList?.map((feature, index) => (
                            <div className="feature" key={index}>
                                <Row style={{ alignItems: "end" }}>
                                    <CheckCircleFilled style={{ marginLeft: "8px" }} />
                                    <span>{NumberConverter.latinToArabic(feature)}</span>
                                </Row>
                                <p>هزینه نهایی ارسال  <span>{plan?.salesPrice && NumberConverter.latinToArabic(NumberConverter?.formatNumberWithCommas((plan?.salesPrice / plan?.sendCount) / 10))}</span> تومان</p>

                            </div>

                        ))}

                </div>
                {
                    isOthersPackage ?

                        <div className="text-button">
                            <span onClick={() => hanleOpenModal(plan)}> فعالسازی

                                <LeftOutlined style={{ marginRight: "10px" }} />
                            </span>
                        </div>
                        :
                        <Button
                            className="buttons-styles"
                            style={{ marginTop: "16px" }}
                            loading={
                                plan.code === selectedPlan?.code
                                    ? activationLoading
                                    : false
                            }
                            onClick={() => hanleOpenModal(plan)}
                        >
                            فعالسازی


                        </Button>
                }



            </div>


        </div>
    )

}