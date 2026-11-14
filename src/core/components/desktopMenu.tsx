import {
  NavLink,
} from "react-router";

import "./styles/desktopMenu.scss";


const isDisabled = true; // your condition



function NavItems({ onClick }: { onClick?: () => void; userName?: string }) {


  return (
    <>
      {/* خانه */}
      <li>
        <NavLink
          to="/home"
          onClick={onClick}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          خانه
        </NavLink>
      </li>



      {/* آیتم‌های مستقل (بدون منوی فرعی) */}
      <li>
        <NavLink
          to="/sendLink"
          onClick={onClick}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          اشتراک آنلاین اسناد
        </NavLink>
      </li>
      <li>

        <NavLink
          to={"/holoo-hamrah"}
          onClick={onClick}
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}

        >
          هلو همراه
        </NavLink>
      </li>
      <li>
        <NavLink
          to={isDisabled ? "" : "/"}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
              return;
            }
            onClick?.(); // your original onClick
          }}
          className={({ isActive }) => {
            if (isDisabled) return "disable-link disabled";
            return isActive ? "nav-link active" : "disable-link";
          }}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
        >
          دستیار تحلیل هلو
        </NavLink>
      </li>


    </>
  );
}

export default NavItems;