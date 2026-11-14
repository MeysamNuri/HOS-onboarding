// SuggestedPackageForm.tsx

import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Typography,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import "./styles/suggestedPackageForm.scss";
import useSuggestedPackageHook from "./hooks/suggestedPackageHook";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function SuggestedPackageForm({ path }: { path: string }) {
    const [form] = Form.useForm();
    const { handlesuggestedPackageOnfinish, isLoading } = useSuggestedPackageHook({ path, form })
    return (
        <div className="suggested-package">
            <div className="suggested-package__header">
                <FileAddOutlined className="suggested-package__icon" />

                <Title level={4} className="suggested-package__title">
                    درخواست بسته ی پیشنهادی
                </Title>

            </div>

            <Text className="suggested-package__subtitle">
                بسته پیشنهادی خود را بر اساس نیاز کسب کارتان درخواست کنید، کارشناسان ما در
                اسرع وقت با شما ارتباط خواهند گرفت
            </Text>

            <Form
                form={form}
                onFinish={handlesuggestedPackageOnfinish}
                layout="vertical"
                className="suggested-package__form"
            >
                <Row gutter={16}>


                    {/* Right */}
                    <Col xs={24} lg={12}>
                        <Row gutter={[16, 6]}>
                            <Col xs={24} md={12}>
                                <Form.Item name="SendCount" rules={[
                                    {
                                        required: true,
                                        message: "تعداد فاکتور را وارد کنید",
                                    },

                                    {
                                        type: "number",
                                        min: 1,
                                        message: "حداقل مقدار ۱ است",
                                    },
                                    {
                                        pattern: /^\d{1,9}$/,
                                        message: "حداکثر تعداد ۹ رقم است",
                                    },
                                ]}>
                                    <InputNumber
                                        min={1}
                                        controls
                                        style={{ width: "100%" }}
                                        size="large"
                                        placeholder="تعداد فاکتور"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="MonthCount"
                                    rules={[
                                        {
                                            required: true,
                                            message: "تعداد ماه را وارد کنید",
                                        },
                                        {
                                            type: "number",
                                            min: 1,
                                            message: "حداقل مقدار ۱ است",
                                        },
                                        {
                                            type: "number",
                                            max: 12,
                                            message: "حداکثر مقدار ۱۲ است",
                                        },
                                    ]}>
                                    <InputNumber
                                        size="large"
                                        placeholder="تعداد ماه"
                                        controls
                                        min={1}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="FieldOfActivity"
                                    rules={[
                                        {
                                            required: true,
                                            message: "حوزه فعالیت را وارد کنید",
                                        }]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="حوزه فعالیت"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="Mobile"
                                    rules={[
                                        {
                                            required: true,
                                            message: "شماره موبایل الزامی است",
                                        },
                                        {
                                            pattern: /^09\d{9}$/,
                                            message: "شماره موبایل معتبر نیست",
                                        },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder="شماره موبایل"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    {/* Left */}
                    <Col xs={24} lg={12}>
                        <Form.Item name="Description">
                            <TextArea
                                rows={7}
                                placeholder="پذیرای نظر و دلیل پیشنهادات شما هستیم"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row style={{ justifyContent: "end" }}>
                    <Button
                        htmlType="submit"
                        type="primary"
                        className="buttons-styles"
                        loading={isLoading}
                    >
                        ثبت و ارسال
                    </Button>
                </Row>
            </Form>
        </div>
    );
}