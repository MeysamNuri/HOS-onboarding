import { Row, Col, ConfigProvider } from "antd";
import BottomModal from '@/core/components/customModal';
import ChooseSerialModal from './chooseSerialModal';
import { type IHolooServicesPlans, } from '../types/models';
import "./styles/HolooServicesPlansList.scss"
import useHolooOnlineServiceHooks from "./hooks/HolooServicesPlansListHooks";
import PackageCard from "./packageCard";
import PackagesDetailsModal from "./packagesDetailsModal";

export default function HolooServicesPlans({ path, packetsList, agentCode }: IHolooServicesPlans) {

    const {
        handleCloseModal,
        openPlansModal,
        hanleOpenModal,
        activationLoading,
        selectedPlan,
        handleClosePackageDetail,
        openPackageDetailModal,
        handleOpenpackageDetails
    } = useHolooOnlineServiceHooks({ path })

    return (
        <Row >
            <Col span={24} >
                <ConfigProvider direction="rtl">
                    <div className="plans-container">

                        <Row justify={"start"} gutter={[24, 24]} >
                            {packetsList?.map((plan,index) => {

                                return (
                                    <Col
                                        xs={24}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={8}
                                        xxl={8}
                                        key={index}
                                    >
                                        <PackageCard
                                            duration={plan?.duration}
                                            selectedPlan={selectedPlan}
                                            hanleOpenModal={hanleOpenModal}
                                            activationLoading={activationLoading}
                                            plan={plan}
                                            agentCode={agentCode}
                                            setOpenPackageDetailsModal={()=>handleOpenpackageDetails(plan)}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </ConfigProvider>

                <BottomModal open={openPlansModal} onClose={handleCloseModal} fitContent>
                    <ChooseSerialModal onCancel={handleCloseModal} />

                </BottomModal>
                <BottomModal open={openPackageDetailModal} onClose={handleClosePackageDetail}>
                    <PackagesDetailsModal />

                </BottomModal>

            </Col>
        </Row>
    )
}