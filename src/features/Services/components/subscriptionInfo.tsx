import { Button, Typography } from "antd";
import "./styles/subscriptionInfo.scss";
import type { IPostOrderRes } from "@core/types/models";
import moment from 'jalali-moment'
import { Link } from 'react-router'
import { NumberConverter } from "@/core/helper/numberConverter";
import {
    CloseOutlined
} from "@ant-design/icons";
const { Text } = Typography;

interface IProps {
    orderResponse: IPostOrderRes | undefined,
  
    onCancel?: () => void
}
const SubscriptionInfo: React.FC<IProps> = ({ orderResponse, onCancel }) => {
    const userSerial = localStorage.getItem("serial")

    return (
        <div className="subscription-info">
            <CloseOutlined onClick={onCancel} className="close-btn" />
            <h3 className="subscription-info__title">
                یک مرحله تا فعال‌سازی اشتراک
            </h3>

            <p className="subscription-info__desc">
                استفاده از این سرویس برای کاربران دارای پشتیبانی فعال نرم افزار هلو
                امکان‌پذیر است.
            </p>



            <div style={{ backgroundColor: "#F7F7F7", padding: "8px 16px", borderRadius: "8px" }}>
                <div className="subscription-info__row">
                    <Text type="secondary">شماره سریال</Text>
                    <Text strong>{ userSerial}</Text>
                </div>

                <div className="subscription-info__row">
                    <Text type="secondary">پایان قرارداد</Text>
                    <Text className="danger"> {
                        orderResponse?.expirationDate ?
                            NumberConverter.latinToArabic(moment(orderResponse?.expirationDate)
                                .format("jYYYY/jMM/jDD")) : "-"

                    }</Text>
                </div>
            </div>


            <p className="subscription-info__note">
                لطفاً پس از تمدید پشتیبانی، برای فعال‌سازی سرویس دوباره به این صفحه
                بازگردید.
            </p>

            <Button
                type="primary"
                danger
                size="large"
                block
                className="buttons-styles"
            >
                <Link to={orderResponse?.renewUrl ?? ""}>    تمدید پشتیبانی نرم‌افزار هلو</Link>

            </Button>
        </div>
    );
};

export default SubscriptionInfo;
