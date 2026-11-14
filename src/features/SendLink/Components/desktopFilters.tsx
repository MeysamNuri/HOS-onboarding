import { Form, Col, Row, Select, Button, Input } from "antd";
import {
    SearchOutlined,
    FilterOutlined
} from "@ant-design/icons";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { resetFilters, setFilters } from '../reducers/filterSlice';
import Footer from "react-multi-date-picker/plugins/range_picker_footer";
import useSentLinksDetailsHooks from "../Hooks/sentLinksDetailsHooks";
import { useEffect } from "react";
import { convertGregorianToPersian } from "@/core/helper/dateConverter";

interface IDesktopFilter {
    handlePageChange: (page: number, pageSize: number) => void
    pageSize: number

}
export default function DesktopFilters({ handlePageChange, pageSize }: IDesktopFilter) {
    const { Option } = Select;
    const [form] = Form.useForm();

    const { handleChange, dates, usersSerialsList, selectedFromDate, selectedToDate, userListLoading,
        setDates,
        setSelectedToDate,
        setSelectedFromDate,
        dispatch,
        filters,
        weekDays
    } = useSentLinksDetailsHooks({})



    const onFinish = (values: any) => {

        const filterValues = {
            serial: values.serial,
            reportType: values?.reportType,
            status: values?.status,
            sendDateFrom: selectedFromDate,
            sendDateTo: selectedToDate,
            search: values?.search
        };

        handlePageChange(1, pageSize)

        dispatch(setFilters(filterValues));

    };
    const handleRemoveFilters = () => {


        form.setFieldsValue({
            reportType: undefined,
            status: undefined,
            serial:undefined
        });

        setDates(undefined);
        setSelectedFromDate("");
        setSelectedToDate("");
        dispatch(resetFilters());

    }
    useEffect(() => {
        if (filters?.search || filters?.serial || filters?.reportType || filters?.status)
            form.setFieldsValue({
                search: filters?.search,
                serial: filters?.serial,
                reportType: filters?.reportType,
                status: filters?.status,

            })
        // Convert Gregorian dates to Persian DateObjects
        if (filters?.sendDateFrom && filters?.sendDateTo) {

            const fromDate = convertGregorianToPersian(filters.sendDateFrom);
            const toDate = convertGregorianToPersian(filters.sendDateTo);
            const dateRange = [fromDate, toDate];

            setDates(dateRange);
            form.setFieldValue("dateRange", dateRange);
        } else {
            setDates(undefined);
            form.setFieldValue("dateRange", undefined);
        }
    }, [filters])
    return (
        <div className="filter-toolbar" >

            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
                className="filter-form"
            >
                <Row style={{ alignItems: "flex-start" }}>
                    <Col xxl={{ span: 2 }} xl={{ span: 2 }} lg={{ span: 3 }} md={{ span: 3 }} sm={{ span: 4 }}>
                        <div className="filter-toolbar__label">
                            <FilterOutlined />
                            <span>فیلترها:</span>
                        </div>
                    </Col>
                    <Col xxl={{ span: 22 }} xl={{ span: 22 }} lg={{ span: 21 }} md={{ span: 21 }} sm={{ span: 20 }}>
                        {/* Row 1 */}
                        <Row gutter={[12, 12]} align="bottom">


                            <Col xxl={{ span: 5 }} xl={{ span: 4 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }}>
                                <Form.Item name="serial" label="شماره سریال">
                                    <Select
                                        showSearch
                                        loading={userListLoading}
                                        placeholder="سریال"
                                        allowClear
                                    >
                                        {usersSerialsList?.Data?.serials?.map((i: string) => (
                                            <Option key={i} value={i}>
                                                {i}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xxl={{ span: 5 }} xl={{ span: 4 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} >
                                <Form.Item name="status" label="وضعیت پیام">
                                    <Select placeholder="وضعیت پیام" allowClear>
                                        <Option value="Read">مشاهده شده</Option>
                                 
                                        <Option value="UnRead">مشاهده نشده</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xxl={{ span: 8 }} xl={{ span: 8 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }}>
                                <Form.Item name="reportType" label="نوع سند">
                                    <Select placeholder="انتخاب سند" allowClear>
                                        <Option value="ProformaInvoice">پیش فاکتور </Option>
                                        <Option value="Invoice">فاکتور </Option>
                                        <Option value="IndividualMoeinReport">گزارش معین اشخاص</Option>
                                    </Select>
                                </Form.Item>
                            </Col>


                        </Row>

                        {/* Row 2 */}
                        <Row gutter={[12, 12]} align="bottom" style={{ marginTop: "15px" }}>

                            <Col xxl={10} xl={8} lg={12} md={10} sm={24}>
                                <Form.Item name="search" label="جستجو">
                                    <Input
                                        placeholder="جستجوی دریافت کننده، متن پیام، موبایل"
                                        prefix={<SearchOutlined />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xxl={8} xl={8} lg={12} md={10} sm={24}>
                                <Form.Item label="از تاریخ تا تاریخ">
                                    <DatePicker
                                        range
                                        value={dates}
                                        weekDays={weekDays}
                                        onChange={handleChange}
                                        calendar={persian}
                                        locale={persian_fa}
                                        format="YYYY/MM/DD"
                                        placeholder="بازه تاریخ را انتخاب کنید"
                                        plugins={[<Footer position="bottom" />]}
                                    />
                                </Form.Item>
                            </Col>


                            <Col xxl={6} xl={8} lg={24} md={12} sm={24}>
                                <div className="actions">
                                    <Button className="clear-btn" onClick={handleRemoveFilters}>
                                        پاک کردن فیلتر
                                    </Button>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="submit-btn"
                                    >
                                        اعمال فیلتر
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Form>
        </div>
    )
}
