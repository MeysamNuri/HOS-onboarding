import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/desktopSideBar";
import NavbarHeader from "../components/NavbarHeader";

import "../components/styles/mainLayout.scss";
import useSideBarHooks from "../components/hooks/sideBarHooks";
import { useMobileSidebarScrollLock } from "../components/hooks/useMobileSidebarScrollLock";

const { Sider, Content } = Layout;

export default function MainLayout() {
    const {
        userName,
        openChooseSerialModal,
        hanleCloseSerialModal,
        serial,
        handleExit,
        isLogin,
        handleChooseSerialModal,
        setSelected,
        selected,
        setCollapsed,
        collapsed,
        isDesktop,
        handleCollapseSideBar,
    } = useSideBarHooks();

    // فقط برای موبایل
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const isMobileSidebarOpen = !isDesktop && mobileSidebarOpen;
    useMobileSidebarScrollLock(isMobileSidebarOpen);

    /**
     * Open mobile sidebar
     */
    const handleOpenMobileSidebar = () => {
        if (!isDesktop) {
            setMobileSidebarOpen(true);
        }
    };

    /**
     * Close mobile sidebar
     */
    const handleCloseMobileSidebar = () => {
        if (!isDesktop) {
            setMobileSidebarOpen(false);
        }
    };

    /**
     * Sidebar toggle
     * Desktop -> collapse
     * Mobile -> open / close full width sidebar
     */
    const handleSidebarToggle = () => {
        if (isDesktop) {
            handleCollapseSideBar();
        } else {
            setMobileSidebarOpen((prev) => !prev);
        }
    };

    return (
        <Layout className={"app-layout " + (isMobileSidebarOpen ? "app-layout--mobile-sidebar-open" : "")}>

            <Sider
                collapsible
                collapsed={isDesktop ? collapsed : !mobileSidebarOpen}
                onCollapse={(value) => {
                    if (isDesktop) {
                        setCollapsed(value);
                    } else {
                        setMobileSidebarOpen(!value);
                    }
                }}
                width={isDesktop ?364:"80%"}
                collapsedWidth={isDesktop ? 85 : 0}
                trigger={null}
                className={`app-layout__sider ${
                    !isDesktop && mobileSidebarOpen
                        ? "app-layout__sider--mobile-open"
                        : ""
                }`}
            >
                <Sidebar
                    handleChooseSerialModal={handleChooseSerialModal}
                    userName={userName}
                    openChooseSerialModal={openChooseSerialModal}
                    hanleCloseSerialModal={hanleCloseSerialModal}
                    serial={serial}
                    selected={selected}
                    setSelected={setSelected}
                    handleExit={handleExit}
                    isLogin={isLogin}
                    collapsed={isDesktop ? collapsed : false}
                    onToggle={handleSidebarToggle}
                    isDesktop={isDesktop}
                />
            </Sider>

            <Layout
                inert={isMobileSidebarOpen}
                className={`app-layout__content-layout ${
                    collapsed && isDesktop ? "collapsed" : ""
                }`}
            >
                <NavbarHeader
                    onMenuClick={handleOpenMobileSidebar}
                />

                <Content className="app-layout__content">
                    <Outlet />
                </Content>
            </Layout>

            {/* Mobile overlay */}
            {!isDesktop && mobileSidebarOpen && (
                <div
                    className="app-layout__mobile-overlay"
                    onClick={handleCloseMobileSidebar}
                />
            )}
        </Layout>
    );
}
