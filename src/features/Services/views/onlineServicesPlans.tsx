import { Row, Col, Typography, Button } from 'antd'

import onlineHooks from '@/core/components/hooks/onlineExtraValuesHooks'
import HolooServicesPlans from '@/core/components/HolooServicesPlansList';
import Errors from "@/core/components/errorPage";
import BottomModal from "../../../core/components/customModal";
import SubscriptionInfo from "../../Services/components/subscriptionInfo";
import InvoiceDemoModal from '../components/invoiceDemoModal';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import FeaturesCard from '../components/features';
import usePersonalCallbackURL from '../hooks/personalCallBack';
import "./onlineServicesPlans.scss"
import PagesHeader from '@/core/components/pagesHeader';
import BannerCarousel from '../../../core/components/bannerCarousel';
// import AgentBanner from '@core/assets/images/agent-banner.svg'

import { ProfileOutlined } from '@ant-design/icons';
import SuggestedPackageForm from '@/core/components/SuggestedPackageForm';
import PackageInfoBar from '@/core/components/PackageInfoBar';


export default function OnlineServicesPlans() {
    const { path,

        handleOpenInvoiceModal,

        isDesktop,
        packetData,
        packetDataLoading,
        agentCode,
        handleCloseInvoiceDemo,
        openInvoiceDemo
    } = onlineHooks()

    const { postLoading, showGuaranteeExpireModal, showErrors, errorModal, limittedOrderResponse,
        orderResponse,
        handleCloseGuranteeModal,
        handleCloseError,
    } = usePersonalCallbackURL()

    if (postLoading || packetDataLoading) return <AjaxLoadingComponent />

    return (
        <Row style={{ width: "100%", marginBottom: "2rem" }}>
            <Col span={24} >
                <div className="page-container">
                    <div>
                        <PagesHeader
                            title="اشتراک آنلاین اسناد"
                            showFirstButton={isDesktop ? true : false}
                            handleButton={handleOpenInvoiceModal}
                            buttonFirstText={"دیدن نمونه فاکتور"}
                        />

                    </div>
                    <BannerCarousel />
                    <br />
                    {
                        !isDesktop ?
                            <Row >

                                <Col span={8}>

                                    <Typography className="page-title">
                                        بسته ها
                                    </Typography>

                                </Col>

                                <Col span={16} style={{ textAlign: "left", padding: " 10px 0" }}>
                                    <Button size="large" className="buttons-outLine" onClick={handleOpenInvoiceModal} style={{ fontSize: "12px" }}>
                                        <ProfileOutlined style={{ fontSize: "15px", marginLeft: "8px" }} />
                                        دیدن نمونه فاکتور
                                    </Button>

                                </Col>
                            </Row> : null
                    }
                    <PackageInfoBar agentCode={agentCode} agentName={packetData?.Data?.agentName}
                        defaultFilter={packetData?.Data?.defaultFilter}
                    />

                    <HolooServicesPlans
                        path={path}
                        agentCode={agentCode ? true : false}
                        packetsList={packetData?.Data?.servicePacket}

                    />
                    <SuggestedPackageForm path={path} />

                    <Typography className="page-title">
                        ویژگی های بسته
                    </Typography>
                    <FeaturesCard />

                    <BottomModal open={openInvoiceDemo} onClose={handleCloseInvoiceDemo}>
                        <InvoiceDemoModal onCancel={handleCloseInvoiceDemo} />

                    </BottomModal>
                    <BottomModal open={errorModal} onClose={handleCloseError} >
                        <Errors messages={showErrors} onClose={handleCloseError} title={limittedOrderResponse !== "" ? limittedOrderResponse : undefined} />
                    </BottomModal>
                    <BottomModal open={showGuaranteeExpireModal} onClose={handleCloseGuranteeModal}>
                        <SubscriptionInfo orderResponse={orderResponse} onCancel={handleCloseGuranteeModal} />
                    </BottomModal>
                </div>
            </Col>
        </Row>


    )

}