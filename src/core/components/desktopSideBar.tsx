import {
    AppstoreOutlined,
    LeftOutlined,
    ArrowLeftOutlined,
    CheckSquareOutlined,
    CustomerServiceOutlined,
    // EditOutlined,
    HomeOutlined,
    LinkOutlined,
    ProfileOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    LogoutOutlined
} from "@ant-design/icons";

import { useState } from "react";
// import Lottie from "lottie-react";
// import glowLoading from "@core/assets/icons/Glow-loading.json";
import ble from "@core/assets/icons/bale-FAB.svg"
import "./styles/desktopSidbar.scss";
import logo from "@core/assets/images/holoo.png";
import userImge from "@core/assets/icons/account_circle.svg";
import { Divider, Tooltip } from "antd";
import { NavLink } from "react-router";
import ChooseSerialModal from "./chooseSerialModal";
import BottomModal from "./customModal";
import { NumberConverter } from "../helper/numberConverter";
import json from '@core/constants/config.json'

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    handleChooseSerialModal: () => void;
    hanleCloseSerialModal: () => void;
    handleExit: () => Promise<unknown>;
    userName: string,
    openChooseSerialModal: boolean,
    isLogin: boolean,
    serial: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>,
    selected: string,
    isDesktop: boolean | undefined

}
const BACK_URL = json.backUrl;

export default function Sidebar({
    collapsed,
    onToggle,
    handleChooseSerialModal,
    userName,
    openChooseSerialModal,
    hanleCloseSerialModal,
    serial,
    handleExit,
    isLogin,
    setSelected,
    selected,
    isDesktop


}: SidebarProps) {
    const [headerScrolled, setHeaderScrolled] = useState(false);
    // const { Panel } = Collapse;
    const handleBle = () => {
        window.open(
            "https://portfolio.invalid/holooonline",
            "_blank",
            "noopener,noreferrer"
        );

    }
    if (collapsed) {
        return (
            <div className="sidebar sidebar--collapsed">
                <div className="sidebar__header">
                    <button
                        className="sidebar__toggle"
                        onClick={onToggle}
                    >
                        <ArrowLeftOutlined />
                    </button>

                    <img
                        src={logo}
                        alt="logo"
                        className="sidebar__logo-small"
                    />
                </div>

                <div className="sidebar__collapsed-content">
                    {
                        isLogin &&
                        <div className="collapsed-profile">
                            <img
                                src={userImge}
                                className="profile-card__avatar"
                                width={35}
                                alt="user"
                            />

                            <div className="collapsed-profile__serial">
                                {NumberConverter?.latinToArabic(serial)}
                            </div>
                        </div>
                    }


                    <Tooltip title="خانه">
                        <NavLink
                            to="/home"
                            onClick={() => {
                                setSelected("home");
                                if (isDesktop) {
                                    onToggle?.();
                                }
                            }}
                        >
                            <HomeOutlined
                                className={`sidebar-icon ${selected === "home" ? "is-active" : ""
                                    }`}

                            />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title="سرویس ها">
                        <AppstoreOutlined
                            className={`sidebar-icon ${selected === "services" ? "is-active" : ""
                                }`}
                            onClick={() => {
                                setSelected("services");
                                onToggle();
                            }}


                        />
                    </Tooltip>
                    <NavLink
                        to="/support"
                        onClick={() => {
                            setSelected("support");
                            if (isDesktop) {
                                onToggle?.();
                            }
                        }}
                    >
                        <CustomerServiceOutlined
                            className={`sidebar-icon ${selected === "support" ? "is-active" : ""
                                }`}

                        />
                    </NavLink>
                    <NavLink
                        to="/sendLink-help"
                        onClick={() => {
                            setSelected("guide");
                            if (isDesktop) {
                                onToggle?.();
                            }
                        }}
                    >
                      <QuestionCircleOutlined 
                            className={`sidebar-icon ${selected === "sendLink-help" ? "is-active" : ""
                                }`}

                        />
                    </NavLink>
                    <Tooltip title="سفارش ها">
                        <NavLink
                            to="/orders/history"
                            onClick={() => setSelected("orders")}
                        >
                            <ProfileOutlined
                                className={`sidebar-icon ${selected === "orders" ? "is-active" : ""
                                    }`}

                            />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title="وضعیت بسته ها">
                        <NavLink
                            to="/active-services"
                            onClick={() => {
                                setSelected("packages");
                                if (isDesktop) {
                                    onToggle?.();
                                }
                            }}
                        >
                            <CheckSquareOutlined
                                className={`sidebar-icon ${selected === "packages" ? "is-active" : ""
                                    }`}

                            />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title=" گزارش ارسال ها">
                        <NavLink
                            to="/sent-links"
                            onClick={() => setSelected("sent-links")}
                        >
                            <LinkOutlined className={`sidebar-icon ${selected === "sent-links" ? "is-active" : ""
                                }`}
                            />
                        </NavLink>
                    </Tooltip>
                    <Tooltip title=" تنظیمات   ">
                        <NavLink
                            to="/settings"
                            onClick={() => {
                                setSelected("settings");
                                if (isDesktop) {
                                    onToggle?.();
                                }
                            }
                            }

                        >
                            <SettingOutlined
                                className={`sidebar-icon ${selected === "settings" ? "is-active" : ""
                                    }`}
                            />
                        </NavLink>
                    </Tooltip>
                    {
                        isLogin &&
                        <Tooltip title=" خروج">
                            <div
                                onClick={handleExit}
                            >
                                <LogoutOutlined
                                    className={`sidebar-icon ${selected === "exit" ? "is-active" : ""
                                        }`}
                                />
                            </div>
                        </Tooltip>
                    }
                    <div
                        onClick={handleBle}
                    >
                        <img src={ble} width={55} />

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="sidebar"
            onScroll={(event) => setHeaderScrolled(event.currentTarget.scrollTop > 0)}
        >
            <div className={"sidebar__header" + (!isDesktop && headerScrolled ? " sidebar__header--scrolled" : "")}>
                <img
                    src={logo}
                    alt="logo"
                    className="sidebar__logo"
                />

                <button
                    className="sidebar__toggle"
                    type="button"
                    aria-label={isDesktop ? "جمع کردن منو" : "بستن منو"}
                    onClick={onToggle}
                >
                    <ArrowLeftOutlined rotate={180} />
                </button>
            </div>

            <div className="profile-card">
                <div className="profile-card__top">

                    {
                        isLogin ?
                            <>
                                {/* <EditOutlined className="profile-card__edit" /> */}

                                <div className="profile-card__content">
                                    <p>{userName}</p>
                                </div>

                                <img
                                    src={userImge}
                                    className="profile-card__avatar"
                                    width={35}
                                    alt="user"
                                />
                            </>
                            :
                            <NavLink
                                to={`https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=home`}
                                className={({ isActive }) =>
                                    isActive ? 'nav-link active' : 'nav-link'
                                }
                            >

                                <span className='login-button'> ورود / فعال‌سازی  </span>

                            </NavLink>
                    }

                </div>

                <div className="profile-card__serial" >
                    <span>سریال نرم افزار هلو</span>

                    <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                            !isLogin
                                ? (window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=home`)
                                : handleChooseSerialModal()
                        }
                    >
                        <span style={{ marginLeft: "10px" }}>
                            {NumberConverter?.latinToArabic(serial)}
                        </span>
                        <LeftOutlined />
                    </div>
                </div>
            </div>

            <NavLink
                to="/home"
                className={`menu-item ${selected === "home"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("home");
                    if (!isDesktop) {
                        onToggle?.();
                    }

                }}
            >
                <span>صفحه اصلی</span>
                <HomeOutlined />
            </NavLink>

            <div
                className={`menu-item ${selected === "sendLink"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => setSelected("sendLink")}
            >
                <span>تمدید و خرید اشتراک</span>
                <AppstoreOutlined />
            </div>
            {
                selected === "sendLink" &&
                <div className="sub-menus">
                    {/* <li><NavLink to="/sendLink" onClick={() => {
                                    if (!isDesktop) {
                                        onToggle?.();
                                    }
                                }} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>مشاهده و خرید بسته ها</NavLink></li>
         */}
                    <NavLink
                        to="/sendLink"
                        className={`sub-menu-item`}
                        onClick={() => {
                            setSelected("sendLink");
                            if (!isDesktop) {
                                onToggle?.();
                            }
                        }
                        }
                    >
                            <LeftOutlined />

                        <li>
                            <span>اشتراک آنلاین اسناد

                                
                            </span>
                        </li>

                    </NavLink>
                    <NavLink
                        to="/holoo-hamrah"
                        className={`sub-menu-item`}
                        onClick={() => {
                            setSelected("sendLink");
                            if (!isDesktop) {
                                onToggle?.();
                            }
                        }
                        }
                    >
                            <LeftOutlined />

                        <li>
                            <span>هلو همراه

                                
                            </span>
                        </li>

                    </NavLink>
                    {/* <div className="assistant-box box-underline">
                        <span> هلو همراه</span>
                        <Row>
                            <div className="pending-badge">
                                <Lottie animationData={glowLoading} loop={true} style={{ width: "35px", height: "35px" }} />
                                <span>در حال انتشار</span>
                            </div>
                            <LeftOutlined />
                        </Row>
                    </div> */}
                    {/* <div className="assistant-box">
                        <span> دستیار تحلیل هلو</span>
                        <Row>
                            <div className="pending-badge">
                                <Lottie animationData={glowLoading} loop={true} style={{ width: "35px", height: "35px" }} />
                                <span>در حال انتشار</span>
                            </div>
                            <LeftOutlined />
                        </Row>
                    </div> */}
                </div>
            }
            <NavLink
                to="/support"
                className={`menu-item ${selected === "support"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("support");
                    if (!isDesktop) {
                        onToggle?.();
                    }
                }
                }
            >
                <span>پشتیبانی</span>
                <CustomerServiceOutlined />
            </NavLink>
            <NavLink
                to="/sendLink-help"
                className={`menu-item ${selected === "sendLink-help"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("sendLink-help");
                    if (!isDesktop) {
                        onToggle?.();
                    }
                }
                }
            >
                <span>راهنمای استفاده</span>
                <QuestionCircleOutlined />
            </NavLink>

            <NavLink
                to="/orders/history"
                className={`menu-item ${selected === "orders"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("orders"); onToggle();
                }}
            >
                <span>سفارش ها</span>
                <ProfileOutlined />
            </NavLink>

            <NavLink
                to="/active-services"
                className={`menu-item ${selected === "active-services"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("active-services");
                    if (!isDesktop) {
                        onToggle?.();
                    }
                }
                }
            >
                <span>وضعیت بسته ها</span>
                <CheckSquareOutlined />
            </NavLink>

            <NavLink
                to="/sent-links"
                className={`menu-item ${selected === "sent-links"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("sent-links");
                    onToggle();
                }}
            >
                <span> گزارش ارسال ها</span>
                <LinkOutlined />
            </NavLink>

            <NavLink
                to="/settings"
                className={`menu-item ${selected === "settings"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={() => {
                    setSelected("settings");
                    if (!isDesktop) {
                        onToggle?.();
                    }
                }
                }
            >
                <span>تنظیمات</span>
                <SettingOutlined />
            </NavLink>
            <Divider />
            {
                isLogin &&
                <div
                    className={`menu-item ${selected === "exit"
                        ? "menu-item--active"
                        : ""
                        }`}
                    onClick={handleExit}
                >
                    <span style={{ color: "red" }}>خروج از حساب کاربری</span>
                    <LogoutOutlined style={{ color: "red" }} />
                </div>
            }
            <div

                className={`menu-item ${selected === "ble"
                    ? "menu-item--active"
                    : ""
                    }`}
                onClick={handleBle}
            >
                <span >پیام رسان بله ( ۲۴/۷ پشتیبانی) </span>
                <img src={ble} width={40} />
            </div>
            <BottomModal open={openChooseSerialModal} onClose={hanleCloseSerialModal} fitContent>
                <ChooseSerialModal onCancel={hanleCloseSerialModal} isFromNavbar={true} />

            </BottomModal>
        </div>
    );
}
