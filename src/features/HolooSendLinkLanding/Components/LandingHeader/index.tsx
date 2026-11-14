import {
  CloseOutlined,
  DownOutlined,
  LeftOutlined,
  LoginOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import holooLogo from "@/core/assets/images/landing/logo.svg";

import type { LandingNavigationItem } from "../../Hooks/useHolooSendLinkLanding";

import "./styles.scss";

interface LandingHeaderProps {
  navigationItems: LandingNavigationItem[];
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onNavigation: (path: string) => void;
  onManagePackages: () => void;
  onLogin: () => void;
  onLogout: () => void;
  isLogin: boolean;
  userName: string;
}

export default function LandingHeader({
  navigationItems,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onNavigation,
  onManagePackages,
  onLogin,
  onLogout,
  isLogin,
  userName,
}: LandingHeaderProps) {
  const loginContent = isLogin ? (
    <>
      <span>{userName || "کاربر"}</span>
      <LogoutOutlined aria-label="خروج" />
    </>
  ) : (
    <>
      <LoginOutlined aria-hidden="true" />
      ورود / ثبت نام
    </>
  );

  const brandButton = (className: string) => (
    <button
      type="button"
      className={className}
      onClick={() => onNavigation("/home")}
      aria-label="صفحه اصلی هلو"
    >
      <img src={holooLogo} alt="هلو" />
    </button>
  );

  return (
    <header className="holoo-landing-header">
      <div className="holoo-landing-header__mobile-topbar">
        {brandButton("holoo-landing-header__mobile-brand")}
        <button
          type="button"
          className="holoo-landing-header__mobile-login"
          onClick={isLogin ? onLogout : onLogin}
        >
          {loginContent}
        </button>
      </div>

      <div className="holoo-landing-header__bar">
        <button
          type="button"
          className="holoo-landing-header__mobile-toggle"
          onClick={onToggleMobileMenu}
          aria-label={isMobileMenuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        {brandButton("holoo-landing-header__brand")}

        <nav
          className={`holoo-landing-header__navigation ${
            isMobileMenuOpen ? "holoo-landing-header__navigation--open" : ""
          }`}
          aria-label="منوی لندینگ هلو"
        >
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                item.active
                  ? "holoo-landing-header__nav-item holoo-landing-header__nav-item--active"
                  : "holoo-landing-header__nav-item"
              }
              onClick={() => !item.disabled && onNavigation(item.path)}
              disabled={item.disabled}
              aria-disabled={item.disabled}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="holoo-landing-header__actions">
          <button
            type="button"
            className="holoo-landing-header__packages-button"
            onClick={onManagePackages}
          >
            <span className="holoo-landing-header__avatar" aria-hidden="true">
              <UserOutlined />
            </span>
            <span>مدیریت بسته‌های من</span>
            <LeftOutlined className="holoo-landing-header__packages-arrow--desktop" />
            <DownOutlined className="holoo-landing-header__packages-arrow--mobile" />
          </button>

          <button
            type="button"
            className="holoo-landing-header__login-button"
            onClick={isLogin ? onLogout : onLogin}
          >
            {loginContent}
          </button>
        </div>
      </div>
    </header>
  );
}
