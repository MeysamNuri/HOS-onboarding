import type { IDiscountProps } from "@/core/types/models";
import { Button, Typography, Row } from "antd";
import Lottie from "lottie-react";
import giftLottie from "@core/assets/icons/Gift.json";
import "./styles/giftModal.scss"
import { CloseOutlined } from "@ant-design/icons";
const GiftModal: React.FC<IDiscountProps> = ({ onCancel}) => {
    const { Text } = Typography
    return (
        <div className="gift-details" >
     <CloseOutlined onClick={onCancel} className="close-btn" />

            <Lottie animationData={giftLottie} loop={true} style={{ width: "350px", margin: "0px auto" }} />
            <Row className="gift-details__text">
                <Text style={{fontSize:"20px"}}>
                    استفاده از کد تخفیف ويژه شما
                </Text>

            </Row>

            <div className="gift-modal-button">
                <Button

                    type="primary"
                    size="large"
                    className="buttons-styles"
                    style={{ width: "100%" }}
                    onClick={onCancel}
                >
                    تایید
                </Button>

            </div>

        </div>
    )
}

export default GiftModal;