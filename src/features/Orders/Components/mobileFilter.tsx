import { useEffect, useState } from "react";
import {
    Button,
    Select,

    ConfigProvider,

    Row,
    Col,

} from "antd";
import {
    DownOutlined,


} from "@ant-design/icons";
import fa_IR from "antd/locale/fa_IR";
import dayjs from "dayjs";
import "dayjs/locale/fa";
import { DatePicker as DatePickerJalali, JalaliLocaleListener } from 'antd-jalali-plus';
import { resetFilters, setFilters } from '../reducers/filterSlice';
import useOrderDetailsHooks from "../Hooks/ordersDetailsHooks";
import { useSelector } from "react-redux";
import { gregorianToJalaliDayjs, toLocalGregorian } from "@/core/helper/dateConverter";
import { getBottomModalPopupContainer } from "@/core/components/customModal";


dayjs.locale("fa");

const { Option } = Select;

const jalaliMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const customJalaliLocale = {
    ...fa_IR,
    DatePicker: {
        ...(fa_IR?.DatePicker || {}),
        lang: {
            ...(fa_IR?.DatePicker?.lang || {}),
            monthNames: jalaliMonths,
            shortMonths: jalaliMonths,
        },
    },
} as any;

interface IFilter {
    userLitLoading: boolean,
    usersList: { serials: string[] } | undefined,
    onClose: () => void
    handlePageChange: (page: number, pageSize: number) => void
    pageSize: number

}
const FiltersPage = ({ userLitLoading, usersList, onClose, handlePageChange, pageSize }: IFilter) => {
    const filters = useSelector((state: any) => state?.filters);
    const [serial, setSerial] = useState<string | undefined>(filters?.serial ?? "");
    const [serviceTypes, setServiceTypes] = useState<string>(filters?.serviceTypes ?? "");
    const [statuses, setStatuses] = useState<string>(filters?.serviceStatus ?? "");

    const [fromDateFilter, setFromDateFilter] = useState<dayjs.Dayjs | null>(
        null
    );
    const [toDateFilter, setToDateFilter] = useState<dayjs.Dayjs | null>(null);
    const {
        dispatch
    } = useOrderDetailsHooks({})

    const statusMapping = {
        Active: { english: "Active", persian: "فعال" },
        Inactive: { english: "Inactive", persian: "غیرفعال" },
        Completed: { english: "Completed", persian: "پایان یافته" },
        PaymentFailed: { english: "PaymentFailed", persian: "پرداخت ناموفق" },
        Reserved: { english: "Reserved", persian: "رزرو شده" },
    };

    const serviceTypeMapping = {
        AI: { english: "AI", persian: "دستیار تحلیل هلو" },
        BI: { english: "BI", persian: "هلو همراه" },
        SendInvoice: { english: "SendInvoice", persian: "اشتراک آنلاین اسناد" },
    };


    const toggleServiceType = (engValue: string) => {
        setServiceTypes(prev => prev === engValue ? "" : engValue);
    };
    const toggleStatus = (engValue: string) => {
        setStatuses(prev => prev === engValue ? "" : engValue);
    };

    // Clear all filters
    const handleClear = () => {
        setSerial("")
        setServiceTypes("");
        setStatuses("");
        setFromDateFilter(null);
        setToDateFilter(null);

        dispatch(resetFilters());
    };

    // Submit handler
    const onFinish = () => {

        const filterValues = {
            serial,
            serviceTypes: serviceTypes,
            serviceStatus: statuses,
            fromDate: toLocalGregorian(fromDateFilter),
            toDate: toLocalGregorian(toDateFilter),

        };

        handlePageChange(1, pageSize)
        dispatch(setFilters(filterValues));
        onClose()
    };


    useEffect(() => {
        if (filters?.fromDate) {
            const jalaliFrom = gregorianToJalaliDayjs(filters.fromDate);
            const jalaliToDate = gregorianToJalaliDayjs(filters.toDate);
            setFromDateFilter(jalaliFrom);
            setToDateFilter(jalaliToDate);
        }
    }, [filters]);
    return (
        <ConfigProvider direction="rtl">
            <div className="filters-page">
                <div className="sheet-handle" />

                <div className="top-header">
                    <h2>فیلترها</h2>
                    <button className="clear-btn" onClick={handleClear}>حذف فیلتر</button>
                </div>

                {/* Serial Number */}
                <div className="section">
                    <label className="label">شماره سریال</label>
                    <Select
                        getPopupContainer={getBottomModalPopupContainer}
                        value={serial}
                        onChange={(value) => setSerial(value)}
                        loading={userLitLoading}
                        className="custom-select"
                    >

                        {
                            usersList?.serials?.map((i: string) =>
                                <Option value={i}>{i}</Option>
                            )
                        }

                    </Select>
                </div>

                {/* Service Type (multi‑select chips) */}
                <div className="section">
                    <label className="label">نوع سرویس</label>
                    <div className="chip-group">
                        {Object.values(serviceTypeMapping).map(({ english, persian }) => (
                            <button
                                key={english}
                                className={`chip ${serviceTypes === english ? "chip-active" : ""}`}
                                onClick={() => toggleServiceType(english)}
                            >
                                {persian}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Package Status (multi‑select chips) */}
                <div className="section">
                    <label className="label">وضعیت بسته</label>
                    <div className="chip-group status-group">
                        {Object.values(statusMapping).map(({ english, persian }) => (
                            <button
                                key={english}
                                className={`chip ${statuses === english ? "chip-active" : ""} `}
                                onClick={() => toggleStatus(english)}
                            >
                                {persian}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date Range */}
                <div className="section">
                    <label className="label">فیلتر زمان</label>
                    <div className="date-row">
                        <div className="date-box">
                            <span className="date-title">از تاریخ</span>
                            <ConfigProvider locale={customJalaliLocale} direction="rtl" getPopupContainer={getBottomModalPopupContainer}>
                                <JalaliLocaleListener />
                                <DatePickerJalali suffixIcon={<DownOutlined style={{ fontSize: "15px" }} />} className="custom-date" value={fromDateFilter} onChange={(value: any) => setFromDateFilter(value)} style={{ width: "100%" }} placeholder="از تاریخ" />
                            </ConfigProvider>
                        </div>
                        <div className="date-box">
                            <span className="date-title">تا تاریخ</span>
                            <ConfigProvider locale={customJalaliLocale} direction="rtl" getPopupContainer={getBottomModalPopupContainer}>
                                <JalaliLocaleListener />
                                <DatePickerJalali suffixIcon={<DownOutlined style={{ fontSize: "15px" }} />} className="custom-date" value={toDateFilter} onChange={(value: any) => setToDateFilter(value)} style={{ width: "100%" }} placeholder="تا تاریخ" />
                            </ConfigProvider>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}

                <Row className="submit-btn" align={"middle"}>
                    <Col span={12}>
                        <Button
                            type="text"
                            className="filter-actions__cancel"
                            onClick={() => onClose()}
                        >
                            انصراف
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button
                            type="primary"
                            className="filter-actions__apply"
                            onClick={onFinish}
                        >
                            اعمال فیلتر
                        </Button>
                    </Col>


                </Row>
            </div>
        </ConfigProvider>
    );
};

export default FiltersPage;
