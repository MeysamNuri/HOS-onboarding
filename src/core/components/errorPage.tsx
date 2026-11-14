import {

    Button,
    Typography
} from "antd";

import invoiceFailed from '@core/assets/images/invoice-error.svg';
import type { AppDispatch } from "@core/constants/store";
import { useDispatch } from "react-redux";
import { setUserPlansValue } from "@/features/HomePage/reducers/userPlansSlice";
import "./styles/errorPageModal.scss"
const { Title, Text } = Typography;

interface IErrorProps {
    messages?: string[] | string,
    onClose?: () => void,
    title?: string,
    buttonText?: string,
    paymentUrl?: string
}
export default function Errors({ messages, title, onClose, buttonText, paymentUrl }: IErrorProps) {

    const dispatch = useDispatch<AppDispatch>();

    const handelBack = () => {
        if (paymentUrl && paymentUrl !== "") {
            window.location.replace(paymentUrl);
            return;
        }
        onClose?.();
        localStorage.removeItem("serviceCode")
        dispatch(
            setUserPlansValue({
                serviceCode: "",
                packetCode: "",
                serial: "",
                phoneNumber: "",
                agentCode: "",
                discountCode: ""
            })
        );
    }
    const defaultTitle = title || "اخطار";
    return (
        < div className="error-modal">

            <div className="error-content">


                <div className="checkmark">
                    <img src={invoiceFailed} alt="Invoice unSuccess" />
                </div>
                <Title level={4} className="confirmation-title" style={{ color: 'red' }}>
                    {defaultTitle}
                </Title>

                <Text className="confirmation-text">
                    {messages ?? "به دلیل عدم دریافت پاسخ از سرویس، عملیات انجام نشد. لطفا مجددا تلاش کنید"}

                </Text>


            </div>
            <div style={{ position: "fixed", bottom: 0, left: 0, padding: "20px", width: "100%" }}>
                <Button type="primary" size="large" className="buttons-styles " style={{ width: "100%" }} onClick={handelBack}>
                    {buttonText ?? "بازگشت"}
                </Button>
            </div>
        </div>
    )
}