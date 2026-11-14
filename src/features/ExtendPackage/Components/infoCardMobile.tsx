import { Card, Typography } from "antd";
import "./infoCard.scss";
import { convertToDomesticFormat } from "@/core/helper/convertPhoneNumber";
import { NumberConverter } from "@/core/helper/numberConverter";

const { Text } = Typography;


interface Props {
  phoneNumber: string|undefined;
  serial: string|null;
}

const InfoCard = ({ phoneNumber,serial }: Props) => {
    
  return (
    <div className="info-card">

        <Card bordered={false} className="info-card__item">
          <div className="info-card__content" style={{marginBottom:"2px",borderRadius:"8px 8px 0 0"}}>
            <Text className="info-card__value">
             شماره موبایل
            </Text>

            <Text className="info-card__label">
              {
              NumberConverter?.latinToArabic(convertToDomesticFormat(phoneNumber??"")) }
            </Text>
          </div>
          <div className="info-card__content" >
            <Text className="info-card__value">
             سریال
            </Text>

            <Text className="info-card__label">
              {
              NumberConverter?.latinToArabic(convertToDomesticFormat(serial??"")) }
            </Text>
          </div>
        </Card>
   
    </div>
  );
};

export default InfoCard;