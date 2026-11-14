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
import useOrderDetailsHooks from "../Hooks/sentLinksDetailsHooks";
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
    onClose: () => void,
    handlePageChange: (page: number, pageSize: number) => void
    pageSize: number
}
const FiltersPage = ({ userLitLoading, usersList, onClose, handlePageChange, pageSize }: IFilter) => {
    const filters = useSelector((state: any) => state?.sendLinksfilters);
    const [serial, setSerial] = useState<string | undefined>(filters?.serial);
    const [orderTypes, setOrderTypes] = useState<string>(filters?.reportType ?? "");
    const [statuses, setStatuses] = useState<string>(filters?.status ?? "");

    const [fromDateFilter, setFromDateFilter] = useState<dayjs.Dayjs | null>(
        null
    );
    const [toDateFilter, setToDateFilter] = useState<dayjs.Dayjs | null>(null);
    const {
        dispatch
    } = useOrderDetailsHooks({})



    const statusMapping = {
        Sent: { english: "Read", persian: "مشاهده شده" },
        Failed: { english: "UnRead", persian: "مشاهده نشده" },
    };

    const orderTypeMapping = {
        ProformaInvoice: { english: "ProformaInvoice", persian: "پیش فاکتور" },
        Invoice: { english: "Invoice", persian: "فاکتور" },
        IndividualMoeinReport: { english: "IndividualMoeinReport", persian: "گزارش معین اشخاص" },
    };


    const toggleServiceType = (engValue: string) => {
        setOrderTypes(prev => prev === engValue ? "" : engValue);
    };
    const toggleStatus = (engValue: string) => {
        setStatuses(prev => prev === engValue ? "" : engValue);
    };

    // Clear all filters
    const handleClear = () => {
        setSerial("")
        setOrderTypes("");
        setStatuses("");
        setFromDateFilter(null);
        setToDateFilter(null);

        dispatch(resetFilters());
    };

    // Submit handler
    const onFinish = () => {

        const filterValues = {
            serial,
            reportType: orderTypes,
            status: statuses,
            sendDateFrom: toLocalGregorian(fromDateFilter),
            sendDateTo: toLocalGregorian(toDateFilter),

        };
        handlePageChange(1, pageSize)

        dispatch(setFilters(filterValues));
        onClose()
    };


    useEffect(() => {
        if (filters?.sendDateFrom) {
            const jalaliFrom = gregorianToJalaliDayjs(filters?.sendDateFrom);
            const jalaliToDate = gregorianToJalaliDayjs(filters?.sendDateTo);
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
                    <label className="label">نوع سند</label>
                    <div className="chip-group">
                        {Object.values(orderTypeMapping).map(({ english, persian }) => (
                            <button
                                key={english}
                                className={`chip ${orderTypes === english ? "chip-active" : ""}`}
                                onClick={() => toggleServiceType(english)}
                            >
                                {persian}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Package Status (multi‑select chips) */}
                <div className="section">
                    <label className="label">وضعیت پیام</label>
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
               <Row className="submit-btn " align={"middle"}>
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
