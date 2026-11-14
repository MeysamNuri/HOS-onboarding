import { Row, Col, Select, Form, Tag, Tabs } from "antd";
import useActiveServicesHooks from "../Hooks.ts/activeServicesHooks";

import PackagesList from "../Components/packagesList";
import AjaxLoadingComponent from "@/core/components/ajaxLoadingComponent";
import PagesHeader from "@/core/components/pagesHeader";
import SendInvoice from "@core/assets/icons/sendInvoice-Icon.svg";
import BI from "@core/assets/icons/BI-icon.svg";
import AI from "@core/assets/icons/AI-icon.svg";
import { useEffect } from "react";
import "./styles.scss"

const serviceIcons = {
    1: SendInvoice,
    2: BI,
    3: AI,
} as const;

export default function ActiveServices() {
    const [form] = Form.useForm();

    const {
        userListLoading, usersSerialsList,
        SelctedSerial,
     
        statusOfPackets,
        isFetching,
        defaultSerial,
        servicesList,
        setSelectedTab,
        selectedTab,
        hasReservedPackage,
        items,
        activeTab,
        setActiveTab
    } = useActiveServicesHooks()

    useEffect(() => {
        if (defaultSerial) {
            form.setFieldsValue({ serial: defaultSerial });
        }
    }, [form,defaultSerial]);

    const { Option } = Select;
    if (isFetching) return <AjaxLoadingComponent />

    return (
        <Row className="active-services-page" style={{ width: "100%" }} >

            <Col span={24}>
                <div className="page-container active-services-page__container">

                    <PagesHeader title="بسته های فعال" />

                    <Tabs
                        className="packages-tabs"
                        defaultActiveKey="active"
                        items={items}
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    />
                    <div className="active-services-filters">
                        {
                            servicesList?.map((i) => (
                                <Tag
                                    key={i.id}
                                    onClick={() => setSelectedTab(i)}
                                    className={
                                        selectedTab?.value === i.value
                                            ? "active-services-badge active-services-badge__active"
                                            : "active-services-badge"
                                    }

                                >
                                    <img src={serviceIcons[i.id as keyof typeof serviceIcons]} alt="" aria-hidden="true" />
                                    {i.value}
                                </Tag>

                            ))
                        }




                    </div>

                    <div className="active-services-content">
                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={24} md={12} lg={12} className="active-services-serial-column">
                                <Form
                                    form={form}
                                    className="active-services-serial-form"
                                    initialValues={{
                                        serial: defaultSerial,
                                    }}
                                >


                                    <Form.Item layout="vertical" name={"serial"} label="شماره سریال" >
                                        <Select
                                            className="active-services-serial-select"
                                            showSearch
                                            onChange={(e) => SelctedSerial(e)}
                                            loading={userListLoading}
                                            style={{ padding: "10px", width: "100%" }}
                                            placeholder="سریال"

                                        >
                                            {
                                                usersSerialsList?.Data?.serials?.map((i: string) =>
                                                    <Option key={i} value={i}>{i}</Option>
                                                )
                                            }


                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                        <PackagesList
                            dataList={statusOfPackets}
                            hasReservedPackage={hasReservedPackage}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    )
}
