import {
    Component,
    type ErrorInfo,
    type ReactNode,
} from "react";
import {
    Button,
    Card,
    Space,
    Typography,
} from "antd";
import {
    WarningOutlined,
    ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(): State {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error);
        console.error("Component stack:", info.componentStack);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        const { children, fallback } = this.props;
        const { hasError } = this.state;

        if (!hasError) {
            return children;
        }

        if (fallback) {
            return fallback;
        }

        return (
            <div
                style={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    boxSizing: "border-box",
                }}
            >
                <Card
                    style={{
                        width: "100%",
                        maxWidth: 420,
                    }}
                >
                    <Space
                        direction="vertical"
                        size="middle"
                        align="center"
                        style={{
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        <WarningOutlined
                            style={{
                                fontSize: 48,
                                color: "#ff4d4f",
                            }}
                        />

                        <Title
                            level={4}
                            style={{
                                margin: 0,
                            }}
                        >
                            مشکلی پیش آمده
                        </Title>

                        <Text type="secondary">
                            در هنگام نمایش این بخش خطایی رخ داده است.
                            <br />
                            لطفاً صفحه را دوباره بارگذاری کنید.
                        </Text>

                        <Button
                            danger
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={this.handleReload}
                            block
                        >
                            بارگذاری مجدد
                        </Button>
                    </Space>
                </Card>
            </div>
        );
    }
}