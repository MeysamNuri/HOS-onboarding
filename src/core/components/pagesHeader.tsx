import { Button, Col, Row, Typography } from "antd";
import Arrow from '@core/assets/icons/arrow-right.svg'
import PDF from '@core/assets/icons/pdf-icon.svg'
import setting from '@core/assets/icons/red-setting.svg'
import "./styles/pagesHeader.scss"
interface IProps {
    title: string,
    text?: string,
    handleButton?: () => void,
    handleSecondButton?: () => void,
    showFirstButton?: boolean,
    showSecondButton?: boolean,
    buttonFirstText?: string,
    buttonSecondText?: string,
    showIcon?: boolean,

}
export default function PagesHeader({
    title,
    text,
    handleButton,
    showFirstButton = false,
    showSecondButton = false,
    buttonFirstText = "",
    buttonSecondText = "",
    showIcon = false,
    handleSecondButton,
}: IProps) {
    const { Text } = Typography
    const hasActions = showFirstButton || showSecondButton;
    const goBack = () => {
        window.history.back();
    };

    return (

        <Row className="header-container">
            <Col xs={24} sm={24} md={hasActions ? 12 : 24}>
                <div className="header-content">
                    <div className="header-title-wrapper">
                        <img
                            src={Arrow}
                            onClick={goBack}
                            style={{ cursor: "pointer" }}
                            alt="back"
                            width={32}
                        />

                        <Typography className="page-title">
                            {title}
                        </Typography>
                    </div>

                    <Text className="header-text">
                        {text}
                    </Text>
                </div>
            </Col>


            {hasActions && <Col xs={24} sm={24} md={12}>
                <Row className="header-actions" gutter={[16, 8]}>
                    {
                        showSecondButton &&
                        <Col>
                            <Button size="large" className="buttons-outLine" onClick={handleSecondButton}>
                                {showIcon && <img src={setting} />}
                                {buttonSecondText}
                            </Button>

                        </Col>
                    }

                    {showFirstButton && (
                        <Col>
                            <Button
                                size="large"
                                className="buttons-styles"
                                onClick={handleButton}
                            >
                                {showIcon && (
                                    <img
                                        src={PDF}
                                        alt="PDF"
                                    />
                                )}

                                {buttonFirstText}
                            </Button>
                        </Col>
                    )}
                </Row>
            </Col>}


        </Row>
    )
}
