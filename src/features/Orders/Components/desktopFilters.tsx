import { Form, Col, Row, Select, Button } from "antd";
import {

    FilterOutlined
} from "@ant-design/icons";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { resetFilters, setFilters } from '../reducers/filterSlice';
import Footer from "react-multi-date-picker/plugins/range_picker_footer";
import useOrderDetailsHooks from "../Hooks/ordersDetailsHooks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { convertGregorianToPersian } from "@/core/helper/dateConverter";
interface IDesktopFilter {
    handlePageChange: (page: number, pageSize: number) => void
    pageSize: number

}

export default function DesktopFilters({ handlePageChange, pageSize }: IDesktopFilter) {
    const { Option } = Select;
    const [form] = Form.useForm();
    const filters = useSelector((state: any) => state?.filters);

    const { handleChange, dates, usersSerialsList, selectedFromDate, selectedToDate, userListLoading,
        setDates,
        setSelectedToDate,
        setSelectedFromDate,
        dispatch,
        weekDays
    } = useOrderDetailsHooks({})


    const onFinish = (values: any) => {

        const filterValues = {
            serial: values.serial,
            serviceTypes: values?.serviceTypes,
            serviceStatus: values?.serviceStatus,
            fromDate: selectedFromDate,
            toDate: selectedToDate,
        };
        handlePageChange(1, pageSize)
        dispatch(setFilters(filterValues));

    };
    const handleRemoveFilters = () => {


        form.setFieldsValue({
            serviceTypes: undefined,
            serviceStatus: undefined,
            serial:undefined
        });

        setDates(undefined);
        setSelectedFromDate("");
        setSelectedToDate("");

        dispatch(resetFilters());
    }

    useEffect(() => {
        if(filters?.serviceTypes||filters?.serial||filters?.serviceStatus)
        form.setFieldsValue({
            serviceTypes: filters?.serviceTypes,
            serial: filters?.serial,
            serviceStatus: filters?.serviceStatus,

        })

        if (filters?.fromDate && filters?.toDate) {

            const fromDate = convertGregorianToPersian(filters.fromDate);
            const toDate = convertGregorianToPersian(filters.toDate);
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

            <Form layout="vertical" onFinish={onFinish} className="filter-form" form={form}>

                <Row gutter={[12, 12]} align="middle" style={{ display: "flex", justifyContent: "space-between"}}>
                    <Col xxl={{ span: 1 }} xl={{ span: 2 }} lg={{ span: 2 }} md={{ span: 4 }} sm={{ span: 3 }}>
                        <div className="filter-toolbar__label">
                            <FilterOutlined />
                            <span>فیلترها:</span>
                        </div>
                    </Col>
                    <Col xxl={{ span: 4 }} xl={{ span:6}} lg={{ span: 10}} md={{ span: 9 }} sm={{ span: 8 }}>
                        <Form.Item name={"serial"} label="شماره سریال">
                            <Select
                                showSearch

                                loading={userListLoading}
                                style={{ width: "100%" }}
                                placeholder="سریال"

                            >
                                {
                                    usersSerialsList?.Data?.serials?.map((i: string) =>
                                        <Option value={i}>{i}</Option>
                                    )
                                }


                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xxl={{ span: 4}} xl={{ span:6 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 8 }}>
                        <Form.Item name={"serviceTypes"} label="نوع سرویس">
                            <Select
                                style={{ width: "100%" }}
                                placeholder="انتخاب سرویس"

                            >
                                <Option value="BI">هلو همراه</Option>
                                <Option value="AI">دستیار تحلیل هلو</Option>
                                <Option value="SendInvoice">اشتراک آنلاین اسناد</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xxl={{ span: 4 }} xl={{ span: 5}} lg={{ span: 13 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Form.Item name={"serviceStatus"} label="وضعیت بسته">
                            <Select
                                style={{ width: "100%" }}
                                placeholder="وضعیت بسته"

                            >
                                <Option value="Active">فعال</Option>
                                <Option value="Inactive">غیرفعال</Option>
                                <Option value="PaymentFailed">پرداخت ناموفق</Option>
                                <Option value="Completed">پایان یافته</Option>
                                <Option value="Reserved">رزرو شده</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xxl={{ span: 4 }} xl={{ span: 5 }} lg={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <Form.Item label="از تاریخ تا تاریخ">
                            <DatePicker
                                weekDays={weekDays}
                                range
                                value={dates}
                                onChange={handleChange}
                                calendar={persian}
                                locale={persian_fa}
                                format="YYYY/MM/DD"
                                placeholder="بازه تاریخ را انتخاب کنید"
                                plugins={[<Footer position="bottom" />]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xxl={{ span: 5 }} xl={{ span:24 }} lg={{ span:24 }} md={{ span: 24 }} sm={{ span: 24 }}>
                        <div className="actions">
                            <Button className="clear-btn" onClick={handleRemoveFilters}>
                                پاک کردن فیلتر
                            </Button>

                            <Button type="primary" htmlType="submit" className="submit-btn">
                                اعمال فیلتر
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}