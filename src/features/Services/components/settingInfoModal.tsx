
import { Typography } from "antd";
import "./styles/settingInfoModal.scss";

const { Title, Text } = Typography;

interface OrderModalProps {
    onCancel?: () => void;

}
const StoreInfo: React.FC<OrderModalProps> = () => {
    return (
        <div className="store-info-container">
       
            <Title level={5} className="form-title">
                اطلاعات کسب و کار
            </Title> 



            <div className="info-section">
                <Text className="section-title">نام فروشگاه</Text>
                <Text className="section-description">
                 تعیین نام فروشگاه جهت نمایش به مشتری
                </Text>
            </div>

            <div className="info-section">
                <Text className="section-title">شعار فروشگاه</Text>
                <Text className="section-description">
               شعار تبلیغاتی فروشگاه، قابل نمایش به مشتری
                </Text>
            </div>

            <div className="info-section">
                <Text className="section-title">پاورقی</Text>
                <Text className="section-description">
                  ثبت اطلاعات دلخواه مثل شماره کارت، جهت نمایش در پاورقی فاکتور
                </Text>
            </div>
        </div>
    );
};

export default StoreInfo;
