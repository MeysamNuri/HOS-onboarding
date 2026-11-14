import { Avatar, Col, Flex, Grid, Row, Select, Tag, Typography } from "antd";
import {
    CalendarOutlined,
    ContactsOutlined,
    DownOutlined
} from "@ant-design/icons";
import "./styles/packageInfoBar.scss";
import Profile from '@core/assets/images/agent-profile.svg'
import { useEffect, useState } from "react";
import { NumberConverter } from "../helper/numberConverter";
import { useDispatch, useSelector } from "react-redux";
import { setPackageFilters } from "../api/slices";
import type { RootState } from "@core/constants/store";

const { Text } = Typography;

const monthOptions = [
    { value: "", label: "همه" },
    { value: "Normal", label: "عادی" },
    { value: "LongTerm", label: "بلند مدت" },

];

const userTypeOptions = [
    { value: "", label: "همه" },
    { value: "Normal", label: "ویژه کاربران عادی" },
    { value: "HighConsumption", label: "ویژه کاربران پر مصرف" },
];
interface IInfoBar {
    agentCode: string | null
    agentName: string | null | undefined,
    defaultFilter?: {
        type: string,
        category: string
    }
}

export default function PackageInfoBar({ agentCode, agentName, defaultFilter }: IInfoBar) {
    const packageFilters = useSelector(
        (state: RootState) => state.packageFilters
    );
    const [userType, setUserType] = useState<string | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const dispatch = useDispatch();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isDesktop = screens.lg;

    useEffect(() => {
        const nextUserType =
            packageFilters?.type || defaultFilter?.type || null;

        const nextCategory =
            packageFilters?.category || defaultFilter?.category || null;

        setUserType(nextUserType);
        setCategory(nextCategory);
    }, [defaultFilter, packageFilters]);

    useEffect(() => {
        if (userType == null && category == null) return;

        dispatch(
            setPackageFilters({
                type: userType,
                category,
            })
        );
    }, [userType, category]);

    return (
        <div className="package-info-bar">
            {
                isDesktop ?
                    <Flex align="center" justify="space-between" wrap="wrap" gap={16}>

                        {
                            agentCode &&

                            <div className="package-info-bar__agent">
                                <Tag className="package-info-bar__discount">
                                    {NumberConverter.latinToArabic("15")}%
                                </Tag>
                                <Text className="package-info-bar__text">
                                    تخفیف بیشتر ویژه نمایندگی {!agentName || agentName == "" ? "-" : agentName}
                                </Text>

                                <Text className="package-info-bar__code">
                                    کد: {agentCode ?? "-"}
                                </Text>
                                <Avatar
                                    size={34}
                                    src={Profile}
                                />
                            </div>

                        }



                        <Flex gap={12} wrap="wrap">
                          
                            <Select
                                value={category}
                                onChange={setCategory}
                                className={category ? "package-info-bar__select selected" : "package-info-bar__select"}
                                style={{ minWidth: 160 }}
                                placeholder="مدت زمان"
                                options={monthOptions}
                                suffixIcon={<DownOutlined />}
                                prefix={<CalendarOutlined />}
                            />
                              <Select
                                value={userType}
                                onChange={setUserType}
                                className={userType ? "package-info-bar__select selected" : "package-info-bar__select"}
                                placeholder="نوع کاربر"
                                style={{ minWidth: 160 }}

                                options={userTypeOptions}
                                suffixIcon={<DownOutlined />}
                                prefix={<ContactsOutlined />}
                            />
                        </Flex>

                    </Flex>
                    :
                    <div>

                        {
                            agentCode &&

                            <div className="mobile-agent-card">


                                <div className="mobile-agent-card__info">
                                    <Avatar
                                        size={44}
                                        src={Profile}
                                        className="mobile-agent-card__avatar"
                                    />
                                    <div className="mobile-agent-card__text">

                                        <Text className="mobile-agent-card__title">
                                            ویژه نمایندگی {agentName}
                                        </Text>

                                        <Text className="mobile-agent-card__code">
                                            کد: {agentCode}
                                        </Text>
                                    </div>


                                </div>
                                <Tag className="mobile-agent-card__discount">
                                    {15}% تخفیف بیشتر
                                </Tag>
                            </div>

                        }

                        <Row gutter={[6, 16]}>

                            <Col xs={12} sm={12}>
                                <Select
                                    value={category}
                                    onChange={setCategory}
                                    className={category ? "package-info-bar__select selected" : "package-info-bar__select"}
                                    placeholder="مدت زمان"
                                    options={monthOptions}
                                    suffixIcon={<DownOutlined />}
                                    prefix={<CalendarOutlined />}
                                />
                            </Col>
                            <Col xs={12} sm={12}>
                                <Select
                                    value={userType}
                                    onChange={setUserType}
                                    className={userType ? "package-info-bar__select selected" : "package-info-bar__select"}
                                    placeholder="نوع کاربر"
                                    options={userTypeOptions}
                                    suffixIcon={<DownOutlined />}
                                    prefix={<ContactsOutlined />}
                                />

                            </Col>
                        </Row>
                    </div>
            }

        </div>
    );
}
