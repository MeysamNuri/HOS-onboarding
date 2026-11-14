
import FAQ from '@/core/components/FAQ'
import HolooServicesPlans from '@/core/components/HolooServicesPlansList'
import onlineHooks from '@/core/components/hooks/onlineExtraValuesHooks'
import { Col, Row, Typography } from 'antd'



export default function BIPlans() {
    const { Title } = Typography

    const { path,

   
        BIFAQ
    } = onlineHooks()
    return (
        <>
           
            <Row className="holoo-sections">
                <Col span={24}>
                    <Title level={3} className='plans-title'>انتخاب بسته سرویس هلو همراه </Title>
                </Col>
                <HolooServicesPlans path={path} />
            </Row>

            <FAQ questions={BIFAQ} />

        </>
    )
}