import { Col, Row, Typography } from "antd";
import type { RootState } from "@core/constants/store";

import "./styles/packageDetails.scss"
import { useSelector } from "react-redux";
import { NumberConverter } from "../helper/numberConverter";
export default function PackagesdetailsModal() {
    const { Title, Text } = Typography
    const packageInfo = useSelector(
        (state: RootState) => state.insertedSelectedPackage
    );

    return (
        <div className="package-details-modal">

            <Row className="package-details-modal__header" >
                <Title level={4}>{packageInfo?.name}</Title>
                <span>{packageInfo?.lable}</span>
            </Row>
            <Row className="unit1">
                <Col span={12} style={{ marginBottom: "13px" }}>
                    <Text>تعداد  ارسال</Text>
                </Col>
                <Col span={12} >
                    <Row style={{ alignItems: "center" }} className="price" gutter={3}>
                        <Col span={21}>
                            <Text>{packageInfo?.sendCount && NumberConverter.latinToArabic(NumberConverter?.formatNumberWithCommas(packageInfo?.sendCount))} </Text>
                        </Col>
                        <Col span={3} style={{textAlign:"center"}}>
                            <span className="price-unit">عدد</span>
                        </Col>
                    </Row>

                </Col>
                <Col span={12}>
                    <Text>قیمت پایه هر ارسال</Text>
                </Col>
                <Col span={12} className="price" >
                    <Row style={{ alignItems: "center" }} gutter={3}>
                        <Col span={21}>
                            <Text>{packageInfo?.pricePerSend && NumberConverter.latinToArabic(NumberConverter?.formatNumberWithCommas(packageInfo?.pricePerSend / 10))} </Text>

                        </Col>
                        <Col span={3}>
                            <span className="price-unit">تومان</span>
                        </Col>
                    </Row>

                </Col>


            </Row>
            <Row className="unit2">
                <Col span={12}>
                    <Text className="title">هزینه ارسال ها</Text>
                </Col>
                <Col span={12} className="price" style={{ marginBottom: "13px" }}>
                    <Row style={{ alignItems: "center" }} gutter={3}>
                        <Col span={21}>
                            <Text>{packageInfo?.sendingCosts && NumberConverter.latinToArabic(NumberConverter?.formatNumberWithCommas(packageInfo?.sendingCosts / 10))} </Text>

                        </Col>
                        <Col span={3}>
                            <span className="price-unit">تومان</span>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Text className="title">قیمت پایه آبونمان</Text>
                </Col>
                <Col span={12} className="price">
                    <Row style={{ alignItems: "center" }} gutter={3}>
                        <Col span={21}>
                            <Text>{packageInfo?.baseSubscriptionPrice && NumberConverter.latinToArabic(NumberConverter?.formatNumberWithCommas(packageInfo?.baseSubscriptionPrice / 10))} </Text>
                        </Col>
                        <Col span={3} style={{textAlign:"center"}}>
                            <span className="price-unit">تومان</span>
                        </Col>
                    </Row>

                </Col>

            </Row>
            <Row className="unit3">
                <Col span={12}>
                    <Text className="title">هزینه بسته</Text>
                </Col>
                <Col span={12} className="price">
                    <Row style={{ alignItems: "center" }} gutter={3}>
                        <Col span={21}>
                            <Text>{packageInfo?.basePrice && NumberConverter.latinToArabic(NumberConverter?.formatNumberWithCommas(packageInfo?.basePrice / 10))} </Text>
                        </Col>
                        <Col span={3}>
                            <span className="price-unit">تومان</span>
                        </Col>
                    </Row>
                </Col>

            </Row>
            <Row className="unit4">
                <Col span={12}>
                    <Text className="title">قابل پرداخت با تخفیف</Text>
                </Col>

                <Col span={12} className="price" style={{ marginBottom: "13px" }}>
                    <Row style={{ alignItems: "center" }} gutter={3}>
                        <Col span={21}>
                            <Text>
                                {packageInfo?.salesPrice && NumberConverter.latinToArabic(NumberConverter.formatNumberWithCommas(packageInfo?.salesPrice / 10))}
                                <span className="badge">{packageInfo?.discountPercent && NumberConverter.latinToArabic(packageInfo.discountPercent)}%</span>
                            </Text>
                        </Col>
                        <Col span={3}>
                            <span className="price-unit">تومان</span>
                        </Col>
                    </Row>
                </Col>

            </Row>

        </div>
    )
}
