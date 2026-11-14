import { Form, Input, Button, Typography } from "antd";
import { toast } from 'react-hot-toast'

import type { IDiscountProps } from "@/core/types/models";

const { Title } = Typography;



const DiscountModal: React.FC<IDiscountProps> = ({ onCancel }) => {
    const [form] = Form.useForm();
    const handleFinish = (values: { discount: string }) => {
        if (values.discount === "holoo") {
            toast.success("کد تخفیف با موفقیت وارد شد")
            localStorage.setItem("discountCode",values.discount)
            onCancel()
        } else {
            toast.error("کد تخفیف اشتباه ")
        }

    }
    return (
        <div className="order-modal">

            <div className="modal-title">
                <Title level={5}>وارد کردن کد تخفیف</Title>

            </div>
            <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
                {/* Optional manual serial input */}

                <Form.Item
                    name="discount"

                >
                    <Input placeholder="مثال: holoo" size="large" className="insert-serial" />
                </Form.Item>


                <Button
                    htmlType="submit"
                    size="large"
                    block
                    className={"buttons-styles"}

                >
                    بررسی کد
                </Button>
            </Form>
        </div>
    );
};

export default DiscountModal;
